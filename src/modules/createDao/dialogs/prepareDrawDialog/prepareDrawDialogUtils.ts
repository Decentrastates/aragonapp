import type { ICreateDrawFormData, IDrawCommonFields } from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';
import type { ITransactionRequest } from '@/shared/utils/transactionUtils';
import { transactionUtils } from '@/shared/utils/transactionUtils';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import { encodeAbiParameters, type Hex } from 'viem';
import { drawPlugin } from '@/plugins/drawPlugin/constants/drawPlugin';
import { drawPluginSetupAbi } from '@/plugins/drawPlugin/utils/drawTransactionUtils/drawPluginAbi';
import type { IPrepareDrawMetadata, IBuildDrawTransactionParams, IBuildDrawProposalActionsParams } from './prepareDrawDialogUtils.api';
import type { TransactionReceipt } from 'viem';
import { drawTransactionUtils } from '@/plugins/drawPlugin/utils/drawTransactionUtils';

// 辅助函数，用于清理组合数据并转换为BigInt
const sanitizeComboData = (combos: Array<{ 
    comboId?: string | bigint | number;
    nftUnits?: Array<{
        id?: string | bigint | number;
        unit?: string | bigint | number;
    }>;
    isEnabled?: boolean;
    maxExchangeCount?: string | bigint | number;
    maxSingleBatch?: string | bigint | number;
    currentExchangeCount?: string | bigint | number;
}> | undefined) => {
    if (!combos) {
        return [];
    }
    
    return combos.map(combo => ({
        comboId: BigInt(combo.comboId ?? '0'),
        nftUnits: (combo.nftUnits ?? []).map((unit) => ({
            id: BigInt(unit.id ?? '0'),
            unit: BigInt(unit.unit ?? '0')
        })),
        isEnabled: combo.isEnabled ?? false,
        maxExchangeCount: BigInt(combo.maxExchangeCount ?? '0'),
        maxSingleBatch: BigInt(combo.maxSingleBatch ?? '0'),
        currentExchangeCount: BigInt(combo.currentExchangeCount ?? '0')
    }));
};

class PrepareDrawDialogUtils {
    private publishDrawProposalMetadata = {
        title: '应用插件安装',
        summary: '该提案将应用插件安装以创建新的抽奖',
    };

    preparePluginsMetadata = (values: ICreateDrawFormData) => {
        console.log('=== preparePluginsMetadata called ===');
        console.log('Values:', values);
        
        const drawPluginMetadata = this.preparePluginMetadata(values);
        const drawMetadata = this.prepareDrawMetadata(values);
        
        const result = { 
            pluginsMetadata: [drawPluginMetadata],
            drawMetadata: drawMetadata
        };
        
        console.log('Prepared plugins metadata:', result);
        console.log('=== preparePluginsMetadata completed ===');
        
        return result;
    };

    private preparePluginMetadata = (values: ICreateDrawFormData) => {
        console.log('=== preparePluginMetadata called ===');
        console.log('Values:', values);
        
        const { name, description, resources } = values;
        const metadata = { name, description, resources };
        
        console.log('Plugin metadata prepared:', metadata);
        console.log('=== preparePluginMetadata completed ===');
        
        return metadata;
    };

    private prepareDrawMetadata = (values: ICreateDrawFormData) => {
        console.log('=== prepareDrawMetadata called ===');
        console.log('Values:', values);
        
        const { name, description, resources, processKey } = values;
        
        const governance: IDrawCommonFields = ('governance' in values) ? values.governance : values as IDrawCommonFields;
        
        const isCreateNewNft = 'isCreateNewNft' in values ? values.isCreateNewNft as boolean | undefined : undefined;
        const isCreateNewToken = 'isCreateNewToken' in values ? values.isCreateNewToken as boolean | undefined : undefined;
        
        const metadata: IPrepareDrawMetadata = { 
            plugins: [],
            draw: undefined,
            name, 
            description, 
            resources, 
            processKey,
            contracts: {
                erc1155: {
                    needsDeployment: isCreateNewNft ?? false,
                    address: governance.tokenB && governance.tokenB !== '' ? governance.tokenB : '0x0000000000000000000000000000000000000000',
                    creationParams: isCreateNewNft ? {
                        uri: 'erc1155Uri' in values ? values.erc1155Uri as string | undefined : undefined,
                    } : undefined
                },
                erc20: {
                    needsDeployment: isCreateNewToken ?? false,
                    address: governance.tokenA && governance.tokenA !== '' ? governance.tokenA : '0x0000000000000000000000000000000000000000',
                    creationParams: isCreateNewToken ? {
                        name: 'tokenName' in values ? values.tokenName as string | undefined : undefined,
                        symbol: 'tokenSymbol' in values ? values.tokenSymbol as string | undefined : undefined,
                        decimals: 'tokenDecimals' in values ? values.tokenDecimals as string | undefined : undefined,
                        initialSupply: 'tokenInitialSupply' in values ? values.tokenInitialSupply as string | undefined : undefined,
                    } : undefined
                },
                eligibleToken: {
                    address: governance.eligibleToken && governance.eligibleToken !== '' ? governance.eligibleToken : '0x0000000000000000000000000000000000000000',
                    isErc1155Eligible: governance.isErc1155Eligible ?? false,
                    eligibleNftId: governance.eligibleNftId,
                }
            }
        };
        
        console.log('Draw metadata prepared:', metadata);
        console.log('=== prepareDrawMetadata completed ===');
        
        return metadata;
    };

    buildPrepareDrawTransaction = (params: IBuildDrawTransactionParams): Promise<ITransactionRequest> => {
        console.log('=== buildPrepareDrawTransaction called ===');
        console.log('Params:', params);
        
        const { values, drawMetadata, dao } = params;
        
        const governance: IDrawCommonFields = ('governance' in values) ? values.governance : values as IDrawCommonFields;
        
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
        
        const sanitizedCombos = sanitizeComboData(governance.nftCombos);
        console.log('Sanitized NFT combos:', sanitizedCombos);
        
        // 根据 drawPluginSetupAbi 的定义，参数顺序应该是：
        // tokenA, tokenB, erc20Name, erc20Symbol, erc1155Uri, 
        // eligibleToken, minTokenAmount, isErc1155Eligible, eligibleNftId, 
        // drawInterval, initNFTCombos
        const tokenA = governance.tokenA && governance.tokenA !== '' ? governance.tokenA : '0x0000000000000000000000000000000000000000';
        const tokenB = governance.tokenB && governance.tokenB !== '' ? governance.tokenB : '0x0000000000000000000000000000000000000000';
        const eligibleToken = governance.eligibleToken && governance.eligibleToken !== '' ? governance.eligibleToken : '0x0000000000000000000000000000000000000000';
        const minTokenAmount = BigInt(governance.minTokenAmount ?? '0');
        const isErc1155Eligible = governance.isErc1155Eligible ?? false;
        const eligibleNftId = BigInt(governance.eligibleNftId ?? '0');
        const drawInterval = BigInt(governance.drawInterval ?? '0');
        
        const isCreateNewToken = 'isCreateNewToken' in values ? values.isCreateNewToken as boolean | undefined : undefined;
        const erc20Name = isCreateNewToken && 'tokenName' in values ? values.tokenName as string | undefined : undefined;
        const erc20Symbol = isCreateNewToken && 'tokenSymbol' in values ? values.tokenSymbol as string | undefined : undefined;
        
        const isCreateNewNft = 'isCreateNewNft' in values ? values.isCreateNewNft as boolean | undefined : undefined;
        const erc1155Uri = isCreateNewNft && 'erc1155Uri' in values ? values.erc1155Uri as string | undefined : undefined;
        
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
            drawInterval
        });
        
        const pluginSettingsData = encodeAbiParameters(drawPluginSetupAbi, [
            tokenA as Hex,
            tokenB as Hex,
            erc20Name ?? '',
            erc20Symbol ?? '',
            erc1155Uri ?? '',
            eligibleToken as Hex,
            minTokenAmount,
            isErc1155Eligible,
            eligibleNftId,
            drawInterval,
            sanitizedCombos,
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
        console.log('Params:', params);
        
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

    preparePublishDrawProposalMetadata = () => {
        console.log('=== preparePublishDrawProposalMetadata called ===');
        console.log('Returning:', this.publishDrawProposalMetadata);
        console.log('=== preparePublishDrawProposalMetadata completed ===');
        
        return this.publishDrawProposalMetadata;
    };
    
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
}

export const prepareDrawDialogUtils = new PrepareDrawDialogUtils();