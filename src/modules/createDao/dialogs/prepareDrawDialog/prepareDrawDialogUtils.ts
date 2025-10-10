import type { ICreateAppFormData } from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';
import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
// import type { ISetupBodyFormNew } from '@/modules/createDao/dialogs/setupBodyDialog/setupBodyDialogDefinitions';
import type { IBuildPrepareCommonPluginInstallDataParams } from '@/modules/createDao/types';
// import { drawPlugin } from '@/plugins/drawPlugin/constants/drawPlugin';
// import { drawPluginSetupAbi } from '@/plugins/drawPlugin/utils/drawTransactionUtils/drawPluginAbi';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { pluginRegistryUtils } from '@/shared/utils/pluginRegistryUtils';
import {
    pluginTransactionUtils,
    type IBuildApplyPluginsInstallationActionsParams,
} from '@/shared/utils/pluginTransactionUtils';
import type { ITransactionRequest } from '@/shared/utils/transactionUtils';
import { transactionUtils } from '@/shared/utils/transactionUtils';
import type { Hex, TransactionReceipt } from 'viem';
// import { conditionFactoryAbi } from './conditionFactoryAbi';
import { PluginInterfaceType } from '@/shared/api/daoService';
import type {
    IBuildDrawProposalActionsParams,
    IBuildDrawTransactionParams,
    IBuildPrepareInstallPluginActionParams,
    IBuildPrepareInstallPluginsActionParams,
} from './prepareDrawDialogUtils.api';

class PrepareDrawDialogUtils {
    private publishDrawProposalMetadata = {
        title: '抽奖应用插件安装',
        summary: '该提案将应用插件安装以创建新的抽奖',
    };

    preparePluginsMetadata = (values: ICreateAppFormData) => {
        
        // 为具体的插件创建详细元数据
        const pluginsMetadata = prepareDrawDialogUtils.prepareDrawMetadata(values);
        
        return { pluginsMetadata: [pluginsMetadata] };
    };

    buildPrepareDrawTransaction = (params: IBuildDrawTransactionParams): Promise<ITransactionRequest> => {

        const { values, drawMetadata, dao } = params;

        // 从流程元数据中获取处理器和插件元数据
        const { plugins: pluginsMetadata } = drawMetadata;

        // 获取网络定义中的插件设置处理器和条件工厂地址
        const { pluginSetupProcessor } = networkDefinitions[dao.network].addresses;

        // 构建插件安装操作数据
        const pluginInstallActions = this.buildPrepareInstallPluginsActionData({ values, dao, pluginsMetadata });
        
        const installActionsData = pluginInstallActions;

        const installActionTransactions = installActionsData.map((data) => ({
            to: pluginSetupProcessor,
            value: BigInt(0),
            data,
        }));

        const encodedTransaction = transactionUtils.encodeTransactionRequests(installActionTransactions, dao.network);

        return Promise.resolve(encodedTransaction);
    };

    buildPublishDrawProposalActions = (params: IBuildDrawProposalActionsParams): ITransactionRequest[] => {
        console.log('PrepareDrawDialogUtils: Building publish draw proposal actions', {
            daoId: params.dao.id,
            setupDataCount: params.setupData.length
        });

        // return actions;
        const { dao, setupData } = params; // 解构参数

        // 构建应用插件安装操作的参数
        const buildActionsParams: IBuildApplyPluginsInstallationActionsParams = {
            dao, // DAO信息
            setupData, // 设置数据
        };
        
        console.log('PrepareDrawDialogUtils: Building apply plugins installation actions', {
            daoId: dao.id,
            setupDataAddresses: setupData.map(data => data.pluginAddress)
        });
        
        // 构建提案操作
        const proposalActions = pluginTransactionUtils.buildApplyPluginsInstallationActions(buildActionsParams);
        
        console.log('PrepareDrawDialogUtils: Proposal actions built', {
            actionsCount: proposalActions.length,
            daoId: dao.id
        });

        // 返回提案操作
        return proposalActions;
    };
    
    // 提案元数据
    preparePublishDrawProposalMetadata = () => this.publishDrawProposalMetadata;

    getPluginInstallationSetupData = (receipt: TransactionReceipt) => {
        console.log('getPluginInstallationSetupData ==========', {
            receipt
        });

        const result = pluginTransactionUtils.getPluginInstallationSetupData(receipt);

        if (result.length === 0) {
            const errorMsg = '未找到插件安装设置数据';
            console.error('PrepareDrawDialogUtils: Error - No setup data found', {
                error: errorMsg,
                transactionHash: receipt.transactionHash,
                logsCount: receipt.logs.length
            });
            throw new Error(errorMsg);
        }

        result.forEach((data, index) => {
            if (data.pluginAddress === '0x0000000000000000000000000000000000000000') {
                const errorMsg = `索引 ${index.toString()} 处的插件地址无效`;
                console.error('Error:', errorMsg);
                throw new Error(errorMsg);
            }
        });

        console.log('Setup data result:', result);

        return result;
    };

    // 准备插件元数据
    // private preparePluginMetadata = (plugin: ISetupBodyFormNew) => {
    //     const { name, description, resources: links } = plugin; // 解构插件信息

    //     // 返回插件元数据
    //     return { name, description, links };
    // };

    private prepareDrawMetadata = (values: ICreateAppFormData) => {
        const { name, description, resources: links } = values;
        const baseMetadata = { name, description, links };
        return baseMetadata;
    };
    
    // 构建准备安装插件操作数据
    private buildPrepareInstallPluginsActionData = (params: IBuildPrepareInstallPluginsActionParams) => {
        const { values, pluginsMetadata, dao } = params; // 解构参数

        const { body } = values; // 获取主体
        body.plugin = PluginInterfaceType.DRAW_PLUGIN;

        const installData = [
            this.buildPrepareInstallPluginActionData({
                body,
                dao,
                metadataCid: pluginsMetadata[0],
            }),
        ];
        
        return installData;
    };

    // 构建准备安装插件操作数据
    private buildPrepareInstallPluginActionData = (params: IBuildPrepareInstallPluginActionParams) => {
        const { metadataCid, dao, body } = params; // 解构参数

        // 将元数据CID转换为十六进制
        const metadata = transactionUtils.stringToMetadataHex(metadataCid);
        // 准备函数参数
        const prepareFunctionParams = { metadata, dao, body };
        // 获取插槽函数
        const prepareFunction = pluginRegistryUtils.getSlotFunction<IBuildPrepareCommonPluginInstallDataParams, Hex>({
            slotId: CreateDaoSlotId.CREATE_DAO_BUILD_PREPARE_PLUGIN_INSTALL_DATA,
            pluginId: body.plugin,
        })!;

        // 调用准备函数并返回结果
        const result = prepareFunction(prepareFunctionParams);
        
        return result;
    };
}

export const prepareDrawDialogUtils = new PrepareDrawDialogUtils();