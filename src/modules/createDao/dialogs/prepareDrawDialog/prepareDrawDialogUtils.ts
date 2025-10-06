import type {
    ICreateDrawFormData,
    IDrawExtendedFields,
} from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';
import { drawPlugin } from '@/plugins/drawPlugin/constants/drawPlugin';
import { drawTransactionUtils } from '@/plugins/drawPlugin/utils/drawTransactionUtils';
import { drawPluginSetupAbi } from '@/plugins/drawPlugin/utils/drawTransactionUtils/drawPluginAbi';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import type { ITransactionRequest } from '@/shared/utils/transactionUtils';
import { transactionUtils } from '@/shared/utils/transactionUtils';
import type { TransactionReceipt } from 'viem';
import { encodeAbiParameters, parseEventLogs, type Hex } from 'viem';
import { conditionFactoryAbi } from './conditionFactoryAbi';
import type { IBuildDrawProposalActionsParams, IBuildDrawTransactionParams } from './prepareDrawDialogUtils.api';

// 辅助函数，用于清理组合数据并转换为BigInt
// const sanitizeComboData = (
//     combos:
//         | Array<{
//               comboId?: number;
//               nftUnits?: Array<{
//                   id?: number;
//                   unit?: number;
//               }>;
//               isEnabled?: boolean;
//               maxExchangeCount?: number;
//               maxSingleBatch?: number;
//               currentExchangeCount?: number;
//           }>
//         | undefined,
// ) => {
//     if (!combos) {
//         return [];
//     }

//     return combos.map((combo) => ({
//         comboId: BigInt(combo.comboId ?? '0'),
//         nftUnits: (combo.nftUnits ?? []).map((unit) => ({
//             id: BigInt(unit.id ?? '0'),
//             unit: BigInt(unit.unit ?? '0'),
//         })),
//         isEnabled: combo.isEnabled ?? false,
//         maxExchangeCount: BigInt(combo.maxExchangeCount ?? '0'),
//         maxSingleBatch: BigInt(combo.maxSingleBatch ?? '0'),
//         currentExchangeCount: BigInt(combo.currentExchangeCount ?? '0'),
//     }));
// };

class PrepareDrawDialogUtils {
    private publishDrawProposalMetadata = {
        title: '抽奖应用插件安装',
        summary: '该提案将应用插件安装以创建新的抽奖',
    };

    preparePluginsMetadata = (values: ICreateDrawFormData) => {
        console.log('Values:', values);
        // 为具体的插件创建详细元数据
        const pluginsMetadata = prepareDrawDialogUtils.prepareDrawMetadata(values);
        return { pluginsMetadata: [pluginsMetadata] };
    };

    buildPrepareDrawTransaction = (params: IBuildDrawTransactionParams): Promise<ITransactionRequest> => {
        console.log('=== buildPrepareDrawTransaction called ===');
        console.log('buildPrepareDrawTransaction Params:', params);

        const { values, drawMetadata, dao } = params;

        // 使用 IDrawExtendedFields 类型
        const governance: IDrawExtendedFields =
            'governance' in values ? values.governance : (values as IDrawExtendedFields);

        if (drawMetadata.plugins.length === 0) {
            const errorMsg = '未找到插件元数据';
            console.error('Error:', errorMsg);
            throw new Error(errorMsg);
        }

        const repositoryAddress = drawPlugin.repositoryAddresses[dao.network];
        console.log('Repository address for network', dao.network, ':', repositoryAddress);

        // 检查仓库地址是否有效
        // 使用类型断言来避免 ESLint 错误，因为我们知道某些网络可能没有有效的仓库地址
        if ((repositoryAddress as string) === '0x0000000000000000000000000000000000000000') {
            const errorMsg = `网络 ${dao.network} 上未找到有效的仓库地址`;
            console.error('Error:', errorMsg);
            throw new Error(errorMsg);
        }
        const targetAddress = repositoryAddress;

        const daoAddr = dao.address as string | undefined;
        if (!daoAddr || daoAddr.length !== 42 || !daoAddr.startsWith('0x')) {
            const errorMsg = '无效的DAO地址: ' + (daoAddr ?? 'undefined');
            console.error('Error:', errorMsg);
            throw new Error(errorMsg);
        }

        console.log('DAO address:', daoAddr);
        console.log('Target address (repository):', targetAddress);

        const initNftCombos = governance.nftCombos ?? [];
        console.log('initNftCombos NFT combos:', initNftCombos);

        const tokenA =
            governance.tokenA && governance.tokenA !== ''
                ? governance.tokenA
                : '0x0000000000000000000000000000000000000000';
        const tokenB =
            governance.tokenB && governance.tokenB !== ''
                ? governance.tokenB
                : '0x0000000000000000000000000000000000000000';
        const eligibleToken =
            governance.eligibleToken && governance.eligibleToken !== ''
                ? governance.eligibleToken
                : '0x0000000000000000000000000000000000000000';
        const minTokenAmount = BigInt((governance.minTokenAmount ?? 0) * 10 ** 18);
        const isErc1155Eligible = governance.isErc1155Eligible ?? false;
        const eligibleNftId = BigInt(governance.eligibleNftId ?? 0);
        const drawInterval = BigInt(governance.drawInterval ?? 0);

        // 修复：正确处理 erc20Name 和 erc20Symbol，根据 isCreateNewToken 的值来决定
        // 当 isCreateNewErc20 为 false 时，这些值应该为空字符串
        const erc20Name = governance.isCreateNewErc20 ? governance.tokenAMetaData.name : '';
        const erc20Symbol = governance.isCreateNewErc20 ? governance.tokenAMetaData.symbol : '';

        // const isCreateNewNft = 'isCreateNewNft' in values ? values.isCreateNewNft as boolean | undefined : undefined;
        const erc1155Uri = governance.tokenBMetaData.erc1155Uri ?? '';

        console.log('Token parameters:', {
            tokenA,
            tokenB,
            erc20Name,
            erc20Symbol,
            erc1155Uri,
            eligibleToken,
            minTokenAmount,
            isErc1155Eligible,
            eligibleNftId,
            drawInterval,
            initNftCombos
        });

        const pluginSettingsData = encodeAbiParameters(drawPluginSetupAbi, [
            tokenA as Hex,
            tokenB as Hex,
            erc20Name, // 当 isCreateNewToken 为 false 时为空字符串
            erc20Symbol, // 当 isCreateNewToken 为 false 时为空字符串
            erc1155Uri,
            eligibleToken as Hex,
            minTokenAmount,
            isErc1155Eligible,
            eligibleNftId,
            drawInterval,
            initNftCombos
        ]);

        console.log('Plugin settings data (encoded):', pluginSettingsData);

        const transactionData = pluginTransactionUtils.buildPrepareInstallationData(
            targetAddress,
            drawPlugin.installVersion,
            pluginSettingsData,
            dao.address as Hex,
        );
        console.log('Transaction data:', transactionData);

        const networkDef = networkDefinitions[dao.network];
        const { pluginSetupProcessor } = networkDef.addresses;
        console.log('Network addresses:', { pluginSetupProcessor, network: dao.network });

        const drawInstallAction = transactionData;
        const installActionsData = [drawInstallAction];
        console.log('Install actions data:', installActionsData);

        const actionValues = { to: pluginSetupProcessor, value: BigInt(0) };
        const installActionTransactions = installActionsData.map((data) => ({ ...actionValues, data }));
        console.log('Install action transactions:', installActionTransactions);

        const encodedTransaction = transactionUtils.encodeTransactionRequests(installActionTransactions, dao.network);
        console.log('Encoded transaction:', encodedTransaction);
        console.log('=== buildPrepareDrawTransaction completed ===');

        return Promise.resolve(encodedTransaction);
    };

    buildPublishDrawProposalActions = (params: IBuildDrawProposalActionsParams): ITransactionRequest[] => {
        console.log('=== buildPublishDrawProposalActions called ===');
        console.log('buildPublishDrawProposalActions Params:', params);

        if (params.setupData.length === 0) {
            const errorMsg = '无效的 setupData - 为空';
            console.error('Error:', errorMsg);
            throw new Error(errorMsg);
        }

        const actions = drawTransactionUtils.buildPublishDrawProposalActions(params);

        if (actions.length === 0) {
            const errorMsg = '未生成任何操作';
            console.error('Error:', errorMsg);
            throw new Error(errorMsg);
        }

        console.log('Proposal actions:', actions);
        console.log('=== buildPublishDrawProposalActions completed ===');

        return actions;
    };
    // 提案元数据
    preparePublishDrawProposalMetadata = () => this.publishDrawProposalMetadata;

    getPluginInstallationSetupData = (receipt: TransactionReceipt) => {
        console.log('=== getPluginInstallationSetupData called ===');
        console.log('Receipt:', receipt);

        const result = pluginTransactionUtils.getPluginInstallationSetupData(receipt);

        if (result.length === 0) {
            const errorMsg = '未找到插件安装设置数据';
            console.error('Error:', errorMsg);
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
        console.log('=== getPluginInstallationSetupData completed ===');

        return result;
    };
    getSafeConditionAddresses = (txReceipt: TransactionReceipt): Hex[] | undefined => {
        const safeConditionLogs = parseEventLogs({
            abi: conditionFactoryAbi,
            eventName: 'SafeOwnerConditionDeployed',
            logs: txReceipt.logs,
            strict: false,
        });

        return safeConditionLogs.map((log) => log.args.newContract).filter((value) => value != null);
    };

    private prepareDrawMetadata = (values: ICreateDrawFormData) => {
        console.log('=== prepareDrawMetadata called ===');
        console.log('prepareDrawMetadata Values:', values);

        const { name, description, resources:links,drawKey } = values;
        const baseMetadata = { name, description, links, drawKey };
        console.log('Base metadata:', baseMetadata);


        // const governance: IDrawExtendedFields =
        //     'governance' in values ? values.governance : (values as IDrawExtendedFields);

        // const isCreateNewNft = 'isCreateNewNft' in values ? (values.isCreateNewNft as boolean | undefined) : undefined;
        // const isCreateNewToken =
        //     'isCreateNewToken' in values ? (values.isCreateNewToken as boolean | undefined) : undefined;

        // // 修复：无论是否创建新代币，都应该获取代币相关信息
        // // 当 isCreateNewToken 为 false 时，我们仍然需要 tokenA 地址，但不需要名称和符号（这些应该从链上获取）
        // const erc20Name = isCreateNewToken
        //     ? governance.tokenAMetaData.name
        //     : undefined;
        // const erc20Symbol = isCreateNewToken
        //     ? governance.tokenAMetaData.symbol
        //     : undefined;

        // const metadata: IPrepareDrawMetadata = {
        //     plugins: [],
        //     draw: undefined
        //     // name,
        //     // description,
        //     // resources,
        //     // contracts: {
        //     //     erc1155: {
        //     //         needsDeployment: isCreateNewNft ?? false,
        //     //         address:
        //     //             governance.tokenB && governance.tokenB !== ''
        //     //                 ? governance.tokenB
        //     //                 : '0x0000000000000000000000000000000000000000',
        //     //         creationParams: isCreateNewNft
        //     //             ? {
        //     //                   uri: governance.erc1155Uri,
        //     //               }
        //     //             : undefined,
        //     //     },
        //     //     erc20: {
        //     //         needsDeployment: isCreateNewToken ?? false,
        //     //         address:
        //     //             governance.tokenA && governance.tokenA !== ''
        //     //                 ? governance.tokenA
        //     //                 : '0x0000000000000000000000000000000000000000',
        //     //         creationParams: isCreateNewToken
        //     //             ? {
        //     //                   name: erc20Name,
        //     //                   symbol: erc20Symbol,
        //     //                   decimals: governance.tokenAMetaData.decimals,
        //     //                   initialSupply: governance.tokenAMetaData.initialSupply,
        //     //               }
        //     //             : undefined,
        //     //     },
        //     //     eligibleToken: {
        //     //         address:
        //     //             governance.eligibleToken && governance.eligibleToken !== ''
        //     //                 ? governance.eligibleToken
        //     //                 : '0x0000000000000000000000000000000000000000',
        //     //         isErc1155Eligible: governance.isErc1155Eligible ?? false,
        //     //         eligibleNftId: governance.eligibleNftId,
        //     //     },
        //     },
        // };

        // console.log('Draw metadata prepared:', values);
        console.log('=== prepareDrawMetadata completed ===');

        return values;
    };
}

export const prepareDrawDialogUtils = new PrepareDrawDialogUtils();
