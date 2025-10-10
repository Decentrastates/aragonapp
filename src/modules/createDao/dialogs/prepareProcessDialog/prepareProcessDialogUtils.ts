import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
import { conditionFactoryAbi } from '@/modules/createDao/dialogs/prepareProcessDialog/conditionFactoryAbi';
import { proposalActionUtils } from '@/modules/governance/utils/proposalActionUtils';
import { sppTransactionUtils } from '@/plugins/sppPlugin/utils/sppTransactionUtils';
import type { IDao } from '@/shared/api/daoService';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { pluginRegistryUtils } from '@/shared/utils/pluginRegistryUtils';
import {
    pluginTransactionUtils,
    type IBuildApplyPluginsInstallationActionsParams,
} from '@/shared/utils/pluginTransactionUtils';
import { transactionUtils, type ITransactionRequest } from '@/shared/utils/transactionUtils';
import { encodeFunctionData, parseEventLogs, type Hex, type TransactionReceipt } from 'viem';
import {
    createProcessFormUtils,
    GovernanceType,
    ProcessPermission,
    type ICreateProcessFormData,
} from '../../components/createProcessForm';
import type { IBuildPreparePluginInstallDataParams } from '../../types';
import { BodyType } from '../../types/enum';
import type { ISetupBodyFormExternal, ISetupBodyFormNew } from '../setupBodyDialog';
import type {
    IBuildDeployExecuteSelectorConditionDataParams,
    IBuildPrepareInstallPluginActionParams,
    IBuildPrepareInstallPluginsActionParams,
    IBuildProcessProposalActionsParams,
    IBuildTransactionParams,
} from './prepareProcessDialogUtils.api';

class PrepareProcessDialogUtils {
    // 提案元数据，用于发布流程创建提案
    private publishProcessProposalMetadata = {
        title: 'Apply plugin installation', // 提案标题
        summary: 'This proposal applies the plugin installation to create the new process', // 提案摘要
    };

    // 准备插件元数据
    preparePluginsMetadata = (values: ICreateProcessFormData) => {
        const { governanceType } = values; // 获取治理类型

        // 准备处理器元数据
        const processorMetadata = prepareProcessDialogUtils.prepareProcessorMetadata(values);

        // 如果是基础治理类型，只返回处理器元数据
        if (governanceType === GovernanceType.BASIC) {
            return { pluginsMetadata: [processorMetadata] };
        }

        // 获取所有新阶段的主体
        const newStageBodies = values.stages
            .flatMap((stage) => stage.bodies) // 展平所有阶段的主体
            .filter((body) => body.type === BodyType.NEW); // 过滤出新类型的主体
        // 为每个新主体准备插件元数据
        const pluginsMetadata = newStageBodies.map((body) => prepareProcessDialogUtils.preparePluginMetadata(body));
        console.log('=== preparePluginsMetadata called ===', pluginsMetadata,processorMetadata);

        // 返回处理器元数据和插件元数据
        return { pluginsMetadata, processorMetadata };
    };

    // 构建准备流程交易
    buildPrepareProcessTransaction = (params: IBuildTransactionParams): Promise<ITransactionRequest> => {
        const { values, processMetadata, dao } = params; // 解构参数
        const { permissionSelectors } = values; // 获取权限选择器

        // 从流程元数据中获取处理器和插件元数据
        const { processor: processorMetadata, plugins: pluginsMetadata } = processMetadata;
        // 获取网络定义中的插件设置处理器和条件工厂地址
        const { pluginSetupProcessor, conditionFactory } = networkDefinitions[dao.network].addresses;

        // 构建部署执行选择器条件的数据
        const deployExecuteSelectorConditionData = this.buildDeployExecuteSelectorConditionData({
            dao,
            permissionSelectors,
        });
        // 如果权限类型为选定，则创建执行条件部署交易
        const executeConditionDeployTransaction =
            values.permissions === ProcessPermission.SELECTED
                ? [{ to: conditionFactory, value: BigInt(0), data: deployExecuteSelectorConditionData }]
                : [];

        // 构建处理器安装操作数据（如果处理器元数据存在）
        const processorInstallAction =
            processorMetadata != null ? this.buildPrepareInstallProcessorActionData(processorMetadata, dao) : undefined;
        // 构建插件安装操作数据
        const pluginInstallActions = this.buildPrepareInstallPluginsActionData({ values, dao, pluginsMetadata });
        // 构建安全条件部署数据
        const safeConditionsDeployData = this.buildSafeConditionsDeployData({ values, dao, pluginsMetadata });

        // 合并所有安装操作数据
        const installActionsData =
            processorInstallAction != null ? [processorInstallAction, ...pluginInstallActions] : pluginInstallActions;

        // 创建安装操作交易列表
        const installActionTransactions = installActionsData.map((data) => ({
            to: pluginSetupProcessor, // 目标地址为插件设置处理器
            value: BigInt(0), // 交易金额为0
            data, // 交易数据
        }));
        console.log('=== buildPrepareProcessTransaction called ===', installActionTransactions);
        // 创建安全条件部署交易列表
        const safeConditionsDeployTransactions = safeConditionsDeployData.map((data) => ({
            to: conditionFactory, // 目标地址为条件工厂
            value: BigInt(0), // 交易金额为0
            data, // 交易数据
        }));
        // 编码所有交易请求
        const encodedTransaction = transactionUtils.encodeTransactionRequests(
            [...executeConditionDeployTransaction, ...installActionTransactions, ...safeConditionsDeployTransactions],
            dao.network, // 网络信息
        );

        // 返回编码后的交易
        return Promise.resolve(encodedTransaction);
    };

    // 构建发布流程提案的操作
    buildPublishProcessProposalActions = (params: IBuildProcessProposalActionsParams): ITransactionRequest[] => {
        const { values, dao, setupData, executeConditionAddress, safeConditionAddresses = [] } = params; // 解构参数

        // 判断是否为高级治理
        const isAdvancedGovernance = values.governanceType === 'ADVANCED';

        // 如果是高级治理，构建插件设置操作
        const processorSetupActions = isAdvancedGovernance
            ? sppTransactionUtils.buildPluginsSetupActions(values, setupData, dao, safeConditionAddresses)
            : [];

        // 构建应用插件安装操作的参数
        const buildActionsParams: IBuildApplyPluginsInstallationActionsParams = {
            dao, // DAO信息
            setupData, // 设置数据
            actions: processorSetupActions, // 处理器设置操作
            executeConditionAddress, // 执行条件地址
        };
        // 构建提案操作
        const proposalActions = pluginTransactionUtils.buildApplyPluginsInstallationActions(buildActionsParams);
        console.log('=== buildPublishProcessProposalActions called ===', proposalActions);

        // 返回提案操作
        return proposalActions;
    };

    // 准备发布流程提案的元数据
    preparePublishProcessProposalMetadata = () => this.publishProcessProposalMetadata;

    // 从交易收据中获取执行选择器条件地址
    getExecuteSelectorConditionAddress = (txReceipt: TransactionReceipt): Hex | undefined => {
        // 解析执行选择器条件部署事件日志
        const selectorLogs = parseEventLogs({
            abi: conditionFactoryAbi,
            eventName: 'ExecuteSelectorConditionDeployed',
            logs: txReceipt.logs,
            strict: false,
        });

        // 返回新合约地址
        return selectorLogs[0]?.args.newContract;
    };

    // 从交易收据中获取安全条件地址列表
    getSafeConditionAddresses = (txReceipt: TransactionReceipt): Hex[] | undefined => {
        // 解析安全所有者条件部署事件日志
        const safeConditionLogs = parseEventLogs({
            abi: conditionFactoryAbi,
            eventName: 'SafeOwnerConditionDeployed',
            logs: txReceipt.logs,
            strict: false,
        });

        // 映射并过滤出非空的新合约地址
        return safeConditionLogs.map((log) => log.args.newContract).filter((value) => value != null);
    };

    // 准备插件元数据
    private preparePluginMetadata = (plugin: ISetupBodyFormNew) => {
        const { name, description, resources: links } = plugin; // 解构插件信息

        // 返回插件元数据
        return { name, description, links };
    };

    // 准备处理器元数据
    private prepareProcessorMetadata = (values: ICreateProcessFormData) => {
        // 解构表单数据
        const { name, description, resources: links, processKey, governanceType } = values;
        // 基础元数据
        const baseMetadata = { name, description, links, processKey };

        // 根据治理类型返回不同的元数据结构
        return governanceType === GovernanceType.BASIC
            ? baseMetadata // 基础治理只返回基础元数据
            : { ...baseMetadata, stageNames: values.stages.map((stage) => stage.name) }; // 高级治理添加阶段名称
    };

    // 构建准备安装处理器操作数据
    private buildPrepareInstallProcessorActionData = (metadata: string, dao: IDao) => {
        // 将元数据字符串转换为十六进制
        const processorMetadata = transactionUtils.stringToMetadataHex(metadata);
        // 构建准备插件安装数据
        const processorInstallData = sppTransactionUtils.buildPreparePluginInstallData(processorMetadata, dao);

        // 返回处理器安装数据
        return processorInstallData;
    };

    // 构建准备安装插件操作数据
    private buildPrepareInstallPluginsActionData = (params: IBuildPrepareInstallPluginsActionParams) => {
        const { values, pluginsMetadata, dao } = params; // 解构参数
        const { governanceType } = values; // 获取治理类型
        console.log('=== buildPrepareInstallPluginsActionData called ===', params);

        // 判断是否为高级治理
        const isAdvancedGovernance = governanceType === GovernanceType.ADVANCED;

        // 如果不是高级治理，处理基础治理情况
        if (!isAdvancedGovernance) {
            const { body } = values; // 获取主体
            // 构建单个插件安装操作数据
            return [this.buildPrepareInstallPluginActionData({ body, dao, metadataCid: pluginsMetadata[0] })];
        }

        // 获取所有新阶段的主体（带阶段索引）
        const newStageBodies = values.stages
            .flatMap((stage, stageIndex) => stage.bodies.map((body) => ({ ...body, stageIndex }))) // 展平主体并添加阶段索引
            .filter((body) => body.type === BodyType.NEW); // 过滤出新类型的主体

        // 为每个主体构建安装数据
        const installData = newStageBodies.map((body, index) => {
            const { votingPeriod: stageVotingPeriod } = values.stages[body.stageIndex].settings; // 获取阶段投票期
            const metadataCid = pluginsMetadata[index]; // 获取对应的元数据CID

            // 构建插件安装操作数据
            return this.buildPrepareInstallPluginActionData({ body, dao, metadataCid, stageVotingPeriod });
        });

        // 返回所有安装数据
        return installData;
    };

    // 构建安全条件部署数据
    private buildSafeConditionsDeployData = (params: IBuildPrepareInstallPluginsActionParams) => {
        const { values } = params; // 解构参数
        const { governanceType } = values; // 获取治理类型

        // 判断是否为高级治理
        const isAdvancedGovernance = governanceType === GovernanceType.ADVANCED;

        // 如果不是高级治理，返回空数组
        if (!isAdvancedGovernance) {
            return [];
        }

        // 获取所有可以创建提案的安全主体
        const safeBodies = values.stages
            .flatMap((stage) => stage.bodies) // 展平所有主体
            .filter(
                (body) => body.canCreateProposal && createProcessFormUtils.isBodySafe(body),
            ) as ISetupBodyFormExternal[]; // 过滤出可以创建提案且为安全类型主体

        // 为每个安全主体编码部署安全所有者条件的函数数据
        const safeInstallData = safeBodies.map((body) =>
            encodeFunctionData({
                abi: conditionFactoryAbi,
                functionName: 'deploySafeOwnerCondition',
                args: [body.address as Hex], // 参数为安全主体地址
            }),
        );

        // 返回安全安装数据
        return safeInstallData;
    };

    // 构建准备安装插件操作数据
    private buildPrepareInstallPluginActionData = (params: IBuildPrepareInstallPluginActionParams) => {
        const { metadataCid, dao, body, stageVotingPeriod } = params; // 解构参数
        console.log('=== buildPrepareInstallPluginActionData called ===', params);

        // 将元数据CID转换为十六进制
        const metadata = transactionUtils.stringToMetadataHex(metadataCid);
        // 准备函数参数
        const prepareFunctionParams = { metadata, dao, body, stageVotingPeriod };
        // 获取插槽函数
        const prepareFunction = pluginRegistryUtils.getSlotFunction<IBuildPreparePluginInstallDataParams, Hex>({
            slotId: CreateDaoSlotId.CREATE_DAO_BUILD_PREPARE_PLUGIN_INSTALL_DATA,
            pluginId: body.plugin,
        })!;

        // 调用准备函数并返回结果
        return prepareFunction(prepareFunctionParams);
    };

    // 构建部署执行选择器条件数据
    private buildDeployExecuteSelectorConditionData = (params: IBuildDeployExecuteSelectorConditionDataParams) => {
        const { dao, permissionSelectors } = params; // 解构参数

        // 按目标地址分组选择器
        const groupedSelectors = Object.groupBy(permissionSelectors, (selector) => selector.to);
        // 构建选择器目标列表
        const selectorTargets = Object.entries(groupedSelectors).map(([address, actions = []]) => ({
            where: address as Hex, // 目标地址
            selectors: actions.map((action) => proposalActionUtils.actionToFunctionSelector(action)) as Hex[], // 函数选择器列表
        }));

        // 编码部署执行选择器条件的函数数据
        const transactionData = encodeFunctionData({
            abi: conditionFactoryAbi,
            functionName: 'deployExecuteSelectorCondition',
            args: [dao.address as Hex, selectorTargets], // 参数为DAO地址和选择器目标列表
        });

        // 返回交易数据
        return transactionData;
    };
}

// 导出准备流程对话框工具实例
export const prepareProcessDialogUtils = new PrepareProcessDialogUtils();
