import type { IBuildPreparePluginInstallDataParams } from '@/modules/createDao/types';
import type { IBuildCreateProposalDataParams } from '@/modules/governance/types';
import { createProposalUtils } from '@/modules/governance/utils/createProposalUtils';
import type { ICreateProposalEndDateForm } from '@/modules/governance/utils/createProposalUtils/createProposalUtils.api';
import type { IBuildPreparePluginUpdateDataParams } from '@/modules/settings/types';
import { pluginTransactionUtils } from '@/shared/utils/pluginTransactionUtils';
import { transactionUtils } from '@/shared/utils/transactionUtils';
import { encodeAbiParameters, encodeFunctionData, zeroHash, type Hex } from 'viem';
import { drawPlugin } from '../../constants/drawPlugin';
import { drawPluginAbi, drawPluginPrepareUpdateAbi, drawPluginSetupAbi } from './drawPluginAbi';
import type { IDrawCommonFields } from '@/modules/createDao/components/createDrawForm/createDrawFormDefinitions';
import type { IBuildDrawProposalActionsParams } from './drawTransactionUtils.api';
import type { ITransactionRequest } from '@/shared/utils/transactionUtils/transactionUtils.api';
import type { IBuildApplyPluginsInstallationActionsParams } from '@/shared/utils/pluginTransactionUtils/pluginTransactionUtils.api';
import type { ITokenSettings, IEligibilityParams, INftCombo } from '../../types';

// 扩展接口以支持条件部署参数
interface IDrawDeploymentParams extends IDrawCommonFields {
    // ERC20 deployment parameters
    erc20Name?: string;
    erc20Symbol?: string;
    erc20Decimals?: number;
    erc20InitialSupply?: string;
    
    // ERC1155 deployment parameters
    erc1155Uri?: string;
}

interface ICreateDrawProposalFormData extends ICreateProposalEndDateForm {
    title: string;
    summary: string;
    resources: Array<{ name: string; url: string }>;
    actions: Array<{ to: string; value: string; data: string }>;
}

interface IBuildVoteDataParams {
    proposalIndex: string;
    vote: {
        value: number;
    };
}

class DrawTransactionUtils {
    buildCreateProposalData = (params: IBuildCreateProposalDataParams<ICreateDrawProposalFormData>): Hex => {
        console.log('=== buildCreateProposalData called ===');
        console.log('Params:', params);
        
        try {
            const { metadata, actions, proposal } = params;

            // Handle proposals without time settings in the following way:
            //   - startDate set to 0
            //   - endDate set to 7 days from now
            const startDate = createProposalUtils.parseStartDate(proposal);
            const endDate =
                proposal.endTimeMode != null
                    ? createProposalUtils.parseEndDate(proposal)
                    : createProposalUtils.createDefaultEndDate();

            // Convert actions to the format expected by the contract
            const contractActions = actions.map((action) => ({
                to: action.to,
                value: action.value,
                data: action.data,
            }));

            const functionArgs = [
                metadata,
                contractActions,
                BigInt(0),
                BigInt(startDate),
                BigInt(endDate)
            ] as const;
            const data = encodeFunctionData({ abi: drawPluginAbi, functionName: 'createProposal', args: functionArgs });
            
            console.log('Encoded createProposal data:', data);
            console.log('=== buildCreateProposalData completed ===');

            return data;
        } catch (error) {
            console.error('=== buildCreateProposalData failed ===');
            console.error('Error details:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
            throw error;
        }
    };

    buildVoteData = (params: IBuildVoteDataParams): Hex => {
        console.log('=== buildVoteData called ===');
        console.log('Params:', params);
        
        try {
            const { proposalIndex, vote } = params;

            // For draw plugin, we'll encode a call to a participate function
            // This is a simplified implementation - in practice, this would need to be 
            // adapted to the actual contract functions
            const functionArgs: [bigint, bigint] = [BigInt(proposalIndex), BigInt(vote.value)];
            const participateAbi = [
                {
                    name: 'participate',
                    type: 'function',
                    inputs: [
                        { name: 'proposalId', type: 'uint256' },
                        { name: 'option', type: 'uint256' },
                    ],
                    outputs: [],
                    stateMutability: 'nonpayable',
                },
            ] as const;
            const data = encodeFunctionData({ abi: participateAbi, functionName: 'participate', args: functionArgs });
            
            console.log('Encoded vote data:', data);
            console.log('=== buildVoteData completed ===');

            return data;
        } catch (error) {
            console.error('=== buildVoteData failed ===');
            console.error('Error details:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
            throw error;
        }
    };

    buildPrepareInstallData = (params: IBuildPreparePluginInstallDataParams<IDrawDeploymentParams>) => {
        console.log('=== buildPrepareInstallData called ===');
        console.log('Params:', params);
        
        try {
            const { dao, body } = params;
            
            // Extract governance settings from the body
            // The structure may vary depending on the form type, so we need to handle different cases
            const governanceSettings: IDrawDeploymentParams = ('governance' in body) ? 
                body.governance : body as unknown as IDrawDeploymentParams;
            
            // Also extract deployment parameters from the body if they exist
            // Use type guards and optional chaining to safely access properties
            // Convert to unknown first, then to Record<string, unknown> to avoid type errors
            const bodyRecord = body as unknown as Record<string, unknown>;
            governanceSettings.erc20Name = bodyRecord.erc20Name as string | undefined;
            governanceSettings.erc20Symbol = bodyRecord.erc20Symbol as string | undefined;
            governanceSettings.erc20Decimals = bodyRecord.erc20Decimals as number | undefined;
            governanceSettings.erc20InitialSupply = bodyRecord.erc20InitialSupply as string | undefined;
            governanceSettings.erc1155Uri = bodyRecord.erc1155Uri as string | undefined;
            
            const { 
                tokenA, 
                tokenB, 
                erc20Name,
                erc20Symbol,
                // erc20Decimals,  // 在新的ABI结构中不再使用
                // erc20InitialSupply,  // 在新的ABI结构中不再使用
                erc1155Uri,
                eligibleToken, 
                minTokenAmount, 
                isErc1155Eligible, 
                eligibleNftId, 
                drawInterval, 
                nftCombos 
            } = governanceSettings;

            console.log('Governance Settings:', governanceSettings);

            const repositoryAddress = drawPlugin.repositoryAddresses[dao.network];
            console.log('Repository Address for network', dao.network, ':', repositoryAddress);
            
            // 检查仓库地址是否有效
            if ((repositoryAddress as string | undefined) === '0x0000000000000000000000000000000000000000') {
                const errorMsg = 'No valid repository address found for network: ' + dao.network;
                console.error('Repository address error:', errorMsg);
                throw new Error(errorMsg);
            }
            
            const targetConfig = pluginTransactionUtils.getPluginTargetConfig(dao, false);
            console.log('Target Config:', targetConfig);

            // 根据新的ABI结构调整参数编码
            const pluginSettingsData = encodeAbiParameters(drawPluginSetupAbi, [
                (tokenA ?? '0x0000000000000000000000000000000000000000') as Hex,
                (tokenB ?? '0x0000000000000000000000000000000000000000') as Hex,
                erc20Name ?? '',
                erc20Symbol ?? '',
                erc1155Uri ?? '',
                (eligibleToken ?? '0x0000000000000000000000000000000000000000') as Hex,
                BigInt(minTokenAmount ?? '0'),
                isErc1155Eligible ?? false,
                BigInt(eligibleNftId ?? '0'),
                BigInt(drawInterval ?? '0'),
                (nftCombos ?? []).map((combo) => ({
                    comboId: BigInt(combo.comboId || '0'),
                    nftUnits: combo.nftUnits.map((unit) => ({
                        id: BigInt(unit.id || '0'),
                        unit: BigInt(unit.unit || '0')
                    })),
                    isEnabled: combo.isEnabled || false,
                    maxExchangeCount: BigInt(combo.maxExchangeCount || '0'),
                    maxSingleBatch: BigInt(combo.maxSingleBatch || '0'),
                    currentExchangeCount: BigInt(combo.currentExchangeCount || '0')
                }))
            ]);

            console.log('Plugin Settings Data (encoded):', pluginSettingsData);

            const transactionData = pluginTransactionUtils.buildPrepareInstallationData(
                repositoryAddress,
                drawPlugin.installVersion,
                pluginSettingsData,
                dao.address as Hex,
            );

            console.log('Transaction Data:', transactionData);
            console.log('=== buildPrepareInstallData completed ===');

            return transactionData;
        } catch (error) {
            console.error('=== buildPrepareInstallData failed ===');
            console.error('Error details:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
            throw error;
        }
    };

    buildPrepareUpdateData = (params: IBuildPreparePluginUpdateDataParams): Hex => {
        console.log('=== buildPrepareUpdateData called ===');
        console.log('Params:', params);
        
        try {
            const { plugin, dao } = params;
            
            const { isSubPlugin, metadataIpfs } = plugin;

            const targetConfig = pluginTransactionUtils.getPluginTargetConfig(dao, isSubPlugin);
            const metadata = metadataIpfs != null ? transactionUtils.stringToMetadataHex(metadataIpfs) : zeroHash;
            const transactionData = encodeAbiParameters(drawPluginPrepareUpdateAbi, [targetConfig, metadata]);

            console.log('Transaction Data:', transactionData);
            console.log('=== buildPrepareUpdateData completed ===');

            return transactionData;
        } catch (error) {
            console.error('=== buildPrepareUpdateData failed ===');
            console.error('Error details:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
            throw error;
        }
    };

    buildPublishDrawProposalActions = (params: IBuildDrawProposalActionsParams): ITransactionRequest[] => {
        console.log('=== buildPublishDrawProposalActions called ===');
        console.log('Params:', params);
        
        try {
            const { setupData, dao, executeConditionAddress } = params;
            
            // 添加对参数的详细检查
            console.log('Setup Data:', setupData);
            console.log('DAO:', dao);
            console.log('Execute Condition Address:', executeConditionAddress);
            
            // 检查 setupData 是否为空数组
            if (setupData.length === 0) {
                console.error('Invalid setupData - empty array');
                throw new Error('Invalid setupData - empty array');
            }
            
            // 验证setupData中的每个项
            setupData.forEach((data, index) => {
                const indexStr = index.toString();
                console.log(`SetupData[${indexStr}]:`, data);
                if (data.pluginAddress === '0x0000000000000000000000000000000000000000') {
                    console.error(`Invalid plugin address at index ${indexStr}:`, data.pluginAddress);
                    throw new Error(`Invalid plugin address at index ${indexStr}`);
                }
                if (data.pluginSetupRepo === '0x0000000000000000000000000000000000000000') {
                    console.error(`Invalid plugin setup repo at index ${indexStr}:`, data.pluginSetupRepo);
                    throw new Error(`Invalid plugin setup repo at index ${indexStr}`);
                }
                if (data.versionTag.release < 0 || data.versionTag.build < 0) {
                    console.error(`Invalid version tag at index ${indexStr}:`, data.versionTag);
                    throw new Error(`Invalid version tag at index ${indexStr}`);
                }
                if (data.preparedSetupData.helpers.length === 0 && data.preparedSetupData.permissions.length === 0) {
                    console.error(`Invalid prepared setup data at index ${indexStr}:`, data.preparedSetupData);
                    throw new Error(`Invalid prepared setup data at index ${indexStr}`);
                }
            });
            
            // Build proposal actions using the same approach as prepareProcessDialog
            // 使用与 prepareProcessDialog 相同的逻辑来构建提案操作，包括权限处理
            const buildActionsParams: IBuildApplyPluginsInstallationActionsParams = {
                dao,
                setupData,
                actions: [], // Draw plugin doesn't need additional actions like SPP plugin
                executeConditionAddress: executeConditionAddress, // Type assertion to match expected type
            };
            
            console.log('Build Actions Params:', buildActionsParams);
            
            const proposalActions = pluginTransactionUtils.buildApplyPluginsInstallationActions(buildActionsParams);
            
            console.log('Proposal Actions:', proposalActions);
            console.log('=== buildPublishDrawProposalActions completed successfully ===');
            
            return proposalActions;
        } catch (error) {
            console.error('=== buildPublishDrawProposalActions failed ===');
            console.error('Error details:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
            throw error;
        }
    };

    /**
     * Build prepare installation data using the new deployment structure according to documentation
     */
    buildPrepareInstallDataNew = (params: IBuildPreparePluginInstallDataParams<IDrawDeploymentParams>) => {
        console.log('=== buildPrepareInstallDataNew called ===');
        console.log('Params:', params);
        
        try {
            const { dao, body } = params;
            
            // Extract governance settings from the body
            // The structure may vary depending on the form type, so we need to handle different cases
            const governanceSettings: IDrawDeploymentParams = ('governance' in body) ? 
                body.governance : body as unknown as IDrawDeploymentParams;
            
            // Also extract deployment parameters from the body if they exist
            // Use type guards and optional chaining to safely access properties
            // Convert to unknown first, then to Record<string, unknown> to avoid type errors
            const bodyRecord = body as unknown as Record<string, unknown>;
            governanceSettings.erc20Name = bodyRecord.erc20Name as string | undefined;
            governanceSettings.erc20Symbol = bodyRecord.erc20Symbol as string | undefined;
            governanceSettings.erc20Decimals = bodyRecord.erc20Decimals as number | undefined;
            governanceSettings.erc20InitialSupply = bodyRecord.erc20InitialSupply as string | undefined;
            governanceSettings.erc1155Uri = bodyRecord.erc1155Uri as string | undefined;
            
            // Map to the new structure according to the documentation
            const tokenSettings: ITokenSettings = {
                tokenA: governanceSettings.tokenA ?? '0x0000000000000000000000000000000000000000',
                tokenB: governanceSettings.tokenB ?? '0x0000000000000000000000000000000000000000',
                erc20Name: governanceSettings.erc20Name,
                erc20Symbol: governanceSettings.erc20Symbol,
                erc1155Uri: governanceSettings.erc1155Uri
            };
            
            const eligibilityParams: IEligibilityParams = {
                eligibleToken: governanceSettings.eligibleToken ?? '0x0000000000000000000000000000000000000000',
                minTokenAmount: BigInt(governanceSettings.minTokenAmount ?? '0'),
                isErc1155Eligible: governanceSettings.isErc1155Eligible ?? false,
                eligibleNftId: governanceSettings.eligibleNftId ? BigInt(governanceSettings.eligibleNftId) : undefined,
                drawInterval: BigInt(governanceSettings.drawInterval ?? '0')
            };
            
            const initNFTCombos: INftCombo[] = (governanceSettings.nftCombos ?? []).map((combo) => ({
                comboId: BigInt(combo.comboId || '0'),
                nftUnits: combo.nftUnits.map((unit) => ({
                    id: BigInt(unit.id || '0'),
                    unit: BigInt(unit.unit || '0')
                })),
                isEnabled: combo.isEnabled || false,
                maxExchangeCount: BigInt(combo.maxExchangeCount || '0'),
                maxSingleBatch: BigInt(combo.maxSingleBatch || '0'),
                currentExchangeCount: BigInt(combo.currentExchangeCount || '0')
            }));

            console.log('Token Settings:', tokenSettings);
            console.log('Eligibility Params:', eligibilityParams);
            console.log('Init NFT Combos:', initNFTCombos);

            const repositoryAddress = drawPlugin.repositoryAddresses[dao.network];
            console.log('Repository Address for network', dao.network, ':', repositoryAddress);
            
            // 检查仓库地址是否有效
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!repositoryAddress || 
                repositoryAddress === '0x0000000000000000000000000000000000000000') {
                const errorMsg = 'No valid repository address found for network: ' + dao.network;
                console.error('Repository address error:', errorMsg);
                throw new Error(errorMsg);
            }
            
            const targetConfig = pluginTransactionUtils.getPluginTargetConfig(dao, false);
            console.log('Target Config:', targetConfig);

            // For the new implementation, we'll use the standard setup ABI since the deployment ABI
            // was removed as per project requirements
            const pluginSettingsData = encodeAbiParameters(drawPluginSetupAbi, [
                tokenSettings.tokenA as Hex,
                tokenSettings.tokenB as Hex,
                tokenSettings.erc20Name ?? '',
                tokenSettings.erc20Symbol ?? '',
                tokenSettings.erc1155Uri ?? '',
                eligibilityParams.eligibleToken as Hex,
                eligibilityParams.minTokenAmount,
                eligibilityParams.isErc1155Eligible,
                eligibilityParams.eligibleNftId ?? BigInt(0),
                eligibilityParams.drawInterval,
                initNFTCombos.map((combo) => ({
                    comboId: combo.comboId,
                    nftUnits: combo.nftUnits.map((unit) => ({
                        id: unit.id,
                        unit: unit.unit
                    })),
                    isEnabled: combo.isEnabled,
                    maxExchangeCount: combo.maxExchangeCount,
                    maxSingleBatch: combo.maxSingleBatch,
                    currentExchangeCount: combo.currentExchangeCount
                }))
            ]);

            console.log('Plugin Settings Data (encoded):', pluginSettingsData);

            const transactionData = pluginTransactionUtils.buildPrepareInstallationData(
                repositoryAddress,
                drawPlugin.installVersion,
                pluginSettingsData,
                dao.address as Hex,
            );

            console.log('Transaction Data:', transactionData);
            console.log('=== buildPrepareInstallDataNew completed ===');

            return transactionData;
        } catch (error) {
            console.error('=== buildPrepareInstallDataNew failed ===');
            console.error('Error details:', error);
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
            throw error;
        }
    };
}

export const drawTransactionUtils = new DrawTransactionUtils();