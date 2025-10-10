import type { IDao, IDaoPlugin } from '@/shared/api/daoService';
import { networkDefinitions } from '@/shared/constants/networkDefinitions';
import {
    encodeAbiParameters,
    encodeFunctionData,
    keccak256,
    parseEventLogs,
    type Hex,
    type TransactionReceipt,
} from 'viem';
import { permissionTransactionUtils } from '../permissionTransactionUtils';
import type { ITransactionRequest } from '../transactionUtils';
import { pluginSetupProcessorAbi } from './abi/pluginSetupProcessorAbi';
import type {
    IBuildApplyPluginsInstallationActionsParams,
    IBuildApplyPluginsUpdateActionsParams,
    IPluginInstallationSetupData,
    IPluginSetupVersionTag,
    IPluginUpdateSetupData,
} from './pluginTransactionUtils.api';

class PluginTransactionUtils {
    // Specifies the type of operation to perform
    // See https://github.com/aragon/osx-commons/blob/main/contracts/src/plugin/IPlugin.sol#L18
    private targetOperation = {
        call: 0,
        delegateCall: 1,
    };

    getPluginInstallationSetupData = (receipt: TransactionReceipt): IPluginInstallationSetupData[] => {
        // console.log('PluginTransactionUtils: Getting plugin installation setup data', {
        //     transactionHash: receipt.transactionHash,
        //     blockNumber: receipt.blockNumber?.toString(),
        //     logsCount: receipt.logs.length
        // });
        
        const { logs } = receipt;
        const eventName = 'InstallationPrepared';
        const installationPreparedLogs = parseEventLogs({ abi: pluginSetupProcessorAbi, eventName, logs });

        // console.log('PluginTransactionUtils: Installation prepared logs found', {
        //     logsCount: installationPreparedLogs.length,
        //     transactionHash: receipt.transactionHash
        // });

        const result = installationPreparedLogs.map(({ args }) => ({
            pluginAddress: args.plugin,
            pluginSetupRepo: args.pluginSetupRepo,
            versionTag: args.versionTag,
            preparedSetupData: args.preparedSetupData,
        }));
        
        // console.log('PluginTransactionUtils: Setup data result', {
        //     resultCount: result.length,
        //     pluginAddresses: result.map(data => data.pluginAddress),
        //     transactionHash: receipt.transactionHash
        // });

        return result;
    };

    getPluginUpdateSetupData = (receipt: TransactionReceipt): IPluginUpdateSetupData[] => {
        // console.log('PluginTransactionUtils: Getting plugin update setup data', {
        //     transactionHash: receipt.transactionHash,
        //     blockNumber: receipt.blockNumber?.toString(),
        //     logsCount: receipt.logs.length
        // });
        
        const { logs } = receipt;
        const eventName = 'UpdatePrepared';
        const installationPreparedLogs = parseEventLogs({ abi: pluginSetupProcessorAbi, eventName, logs });

        // console.log('PluginTransactionUtils: Update prepared logs found', {
        //     logsCount: installationPreparedLogs.length,
        //     transactionHash: receipt.transactionHash
        // });

        const result = installationPreparedLogs.map(({ args }) => ({
            pluginSetupRepo: args.pluginSetupRepo,
            versionTag: args.versionTag,
            preparedSetupData: args.preparedSetupData,
            initData: args.initData,
        }));
        
        // console.log('PluginTransactionUtils: Update setup data result', {
        //     resultCount: result.length,
        //     transactionHash: receipt.transactionHash
        // });

        return result;
    };

    buildPrepareInstallationData = (pluginAddress: Hex, versionTag: IPluginSetupVersionTag, data: Hex, dao: Hex) => {
        // console.log('PluginTransactionUtils: Building prepare installation data', {
        //     pluginAddress,
        //     versionTag,
        //     dataLength: data.length,
        //     dao
        // });

        const pluginSetupRef = { pluginSetupRepo: pluginAddress, versionTag };
        const transactionData = encodeFunctionData({
            abi: pluginSetupProcessorAbi,
            functionName: 'prepareInstallation',
            args: [dao, { pluginSetupRef, data }],
        });

        // console.log('PluginTransactionUtils: Prepare installation transaction data', {
        //     transactionDataLength: transactionData.length
        // });

        return transactionData;
    };

    getPluginTargetConfig = (dao: IDao, isAdvancedGovernance?: boolean) => {
        
        const { globalExecutor } = networkDefinitions[dao.network].addresses;

        const target = isAdvancedGovernance ? globalExecutor : (dao.address as Hex);
        const operation = isAdvancedGovernance ? this.targetOperation.delegateCall : this.targetOperation.call;

        console.log('PluginTransactionUtils: Plugin target config result', {
            target,
            operation,
        });

        return { target, operation };
    };

    buildApplyPluginsInstallationActions = (
        params: IBuildApplyPluginsInstallationActionsParams,
    ): ITransactionRequest[] => {
        console.log('PluginTransactionUtils: Building apply plugins installation actions', {
            daoId: params.dao.id,
            setupDataCount: params.setupData.length,
            actionsCount: params.actions?.length,
            hasExecuteCondition: !!params.executeConditionAddress
        });
        
        const { dao, setupData, actions = [], executeConditionAddress } = params;
        const daoAddress = dao.address as Hex;

        const { pluginSetupProcessor } = networkDefinitions[dao.network].addresses;

        // Temporarily grant the ROOT_PERMISSION to the plugin setup processor contract.
        const [grantRootTx, revokeRootTx] = permissionTransactionUtils.buildGrantRevokePermissionTransactions({
            where: daoAddress,
            who: pluginSetupProcessor,
            what: permissionTransactionUtils.permissionIds.rootPermission,
            to: daoAddress,
        });

        // console.log('PluginTransactionUtils: Root permission transactions built', {
        //     grantRootTxTo: grantRootTx.to,
        //     revokeRootTxTo: revokeRootTx.to,
        //     daoId: dao.id
        // });

        // If executeConditionAddress is provided, we need to revoke the execute permission and grant it with the condition.
        // The first plugin in the setupData is either the SPP or the plugin for basic governance processes.
        const needsExecuteCondition = executeConditionAddress != null;
        const executeWithConditionTransactions = needsExecuteCondition
            ? permissionTransactionUtils.buildExecuteConditionTransactions({
                  dao: daoAddress,
                  plugin: setupData[0].pluginAddress,
                  executeCondition: executeConditionAddress,
              })
            : [];

        // console.log('PluginTransactionUtils: Execute condition transactions', {
        //     transactionsCount: executeWithConditionTransactions.length,
        //     needsExecuteCondition,
        //     daoId: dao.id
        // });

        const applyInstallationActions = setupData.map((data) => this.setupInstallationDataToAction(data, dao));

        // console.log('PluginTransactionUtils: Apply installation actions', {
        //     actionsCount: applyInstallationActions.length,
        //     daoId: dao.id
        // });

        const result = [
            grantRootTx,
            ...applyInstallationActions,
            ...actions,
            revokeRootTx,
            ...executeWithConditionTransactions,
        ];

        // console.log('PluginTransactionUtils: Final installation actions result', {
        //     totalCount: result.length,
        //     grantRootTx: grantRootTx.to,
        //     applyInstallationActionsCount: applyInstallationActions.length,
        //     actionsCount: actions.length,
        //     revokeRootTx: revokeRootTx.to,
        //     executeWithConditionTransactionsCount: executeWithConditionTransactions.length,
        //     daoId: dao.id
        // });

        return result;
    };

    buildApplyPluginsUpdateActions = (params: IBuildApplyPluginsUpdateActionsParams): ITransactionRequest[] => {
        // console.log('PluginTransactionUtils: Building apply plugins update actions', {
        //     daoId: params.dao.id,
        //     pluginsCount: params.plugins.length,
        //     setupDataCount: params.setupData.length
        // });
        
        const { dao, plugins, setupData } = params;
        const daoAddress = dao.address as Hex;

        const requiresRootPermission = setupData.some((data) => data.preparedSetupData.permissions.length > 0);
        
        // console.log('PluginTransactionUtils: Root permission requirement check', {
        //     requiresRootPermission,
        //     permissionsInSetupData: setupData.map(data => data.preparedSetupData.permissions.length),
        //     daoId: dao.id
        // });

        const applyUpdateTransactions = plugins
            .map((plugin, index) => this.buildApplyPluginUpdateAction(dao, plugin, setupData[index]))
            .flat();

        // console.log('PluginTransactionUtils: Apply update transactions built', {
        //     transactionsCount: applyUpdateTransactions.length,
        //     daoId: dao.id
        // });

        if (requiresRootPermission) {
            // Grant ROOT_PERMISSION to the PSP contract if some plugin update requires permissions to be granted or revoked
            const [grantRootTx, revokeRootTx] = permissionTransactionUtils.buildGrantRevokePermissionTransactions({
                where: daoAddress,
                who: networkDefinitions[dao.network].addresses.pluginSetupProcessor,
                what: permissionTransactionUtils.permissionIds.rootPermission,
                to: daoAddress,
            });

            applyUpdateTransactions.unshift(grantRootTx);
            applyUpdateTransactions.push(revokeRootTx);
            
            // console.log('PluginTransactionUtils: Root permission transactions added for update', {
            //     grantRootTxTo: grantRootTx.to,
            //     revokeRootTxTo: revokeRootTx.to,
            //     daoId: dao.id
            // });
        }

        // console.log('PluginTransactionUtils: Final update actions result', {
        //     totalCount: applyUpdateTransactions.length,
        //     requiresRootPermission,
        //     daoId: dao.id
        // });

        return applyUpdateTransactions;
    };

    private buildApplyPluginUpdateAction = (dao: IDao, plugin: IDaoPlugin, setupData: IPluginUpdateSetupData) => {
        // console.log('PluginTransactionUtils: Building apply plugin update action', {
        //     pluginAddress: plugin.address,
        //     daoId: dao.id,
        //     setupDataPermissionsCount: setupData.preparedSetupData.permissions.length
        // });
        
        const { pluginSetupProcessor } = networkDefinitions[dao.network].addresses;
        const daoAddress = dao.address as Hex;

        // Temporarily grant the UPGRADE_PLUGIN_PERMISSION to the plugin setup processor contract.
        const [grantUpgradeTx, revokeUpgradeTx] = permissionTransactionUtils.buildGrantRevokePermissionTransactions({
            where: plugin.address as Hex,
            who: pluginSetupProcessor,
            what: permissionTransactionUtils.permissionIds.upgradePluginPermission,
            to: daoAddress,
        });

        // console.log('PluginTransactionUtils: Upgrade permission transactions built', {
        //     grantUpgradeTxTo: grantUpgradeTx.to,
        //     revokeUpgradeTxTo: revokeUpgradeTx.to,
        //     pluginAddress: plugin.address,
        //     daoId: dao.id
        // });

        const applyUpdateTransaction = this.setupUpdateDataToAction(dao, plugin, setupData);

        const result = [grantUpgradeTx, applyUpdateTransaction, revokeUpgradeTx];
        
        // console.log('PluginTransactionUtils: Apply plugin update action result', {
        //     resultCount: result.length,
        //     pluginAddress: plugin.address,
        //     daoId: dao.id
        // });

        return result;
    };

    private setupUpdateDataToAction = (dao: IDao, plugin: IDaoPlugin, setupData: IPluginUpdateSetupData) => {
        // console.log('PluginTransactionUtils: Setting up update data to action', {
        //     pluginAddress: plugin.address,
        //     daoId: dao.id,
        //     setupDataVersionTag: setupData.versionTag,
        //     setupDataInitDataLength: setupData.initData?.length
        // });
        
        const { pluginSetupRepo, versionTag, initData, preparedSetupData } = setupData;
        const { permissions, helpers } = preparedSetupData;

        const { pluginSetupProcessor } = networkDefinitions[dao.network].addresses;
        const helpersHash = this.hashHelpers(helpers);
        const pluginSetupRef = { versionTag, pluginSetupRepo };

        const transactionData = encodeFunctionData({
            abi: pluginSetupProcessorAbi,
            functionName: 'applyUpdate',
            args: [
                dao.address as Hex,
                { plugin: plugin.address as Hex, pluginSetupRef, initData, permissions, helpersHash },
            ],
        });

        const result = { to: pluginSetupProcessor, data: transactionData, value: BigInt(0) };
        
        // console.log('PluginTransactionUtils: Setup update data to action result', {
        //     resultTo: result.to,
        //     resultDataLength: result.data.length,
        //     pluginAddress: plugin.address,
        //     daoId: dao.id
        // });

        return result;
    };

    private setupInstallationDataToAction = (setupData: IPluginInstallationSetupData, dao: IDao) => {
        // console.log('PluginTransactionUtils: Setting up installation data to action', {
        //     pluginAddress: setupData.pluginAddress,
        //     daoId: dao.id,
        //     setupDataVersionTag: setupData.versionTag,
        //     setupDataPermissionsCount: setupData.preparedSetupData.permissions.length
        // });
        
        const { pluginSetupRepo, versionTag, pluginAddress, preparedSetupData } = setupData;
        const { permissions, helpers } = preparedSetupData;

        const { pluginSetupProcessor } = networkDefinitions[dao.network].addresses;
        const helpersHash = this.hashHelpers(helpers);
        const pluginSetupRef = { versionTag, pluginSetupRepo };

        const transactionData = encodeFunctionData({
            abi: pluginSetupProcessorAbi,
            functionName: 'applyInstallation',
            args: [dao.address as Hex, { pluginSetupRef, plugin: pluginAddress, permissions, helpersHash }],
        });

        const result = { to: pluginSetupProcessor, data: transactionData, value: BigInt(0) };
        
        // console.log('PluginTransactionUtils: Setup installation data to action result', {
        //     resultTo: result.to,
        //     resultDataLength: result.data.length,
        //     pluginAddress,
        //     daoId: dao.id
        // });

        return result;
    };

    private hashHelpers = (helpers: readonly Hex[]): Hex => {
        // console.log('PluginTransactionUtils: Hashing helpers', {
        //     helpersCount: helpers.length
        // });
        
        const result = keccak256(encodeAbiParameters([{ type: 'address[]' }], [helpers]));
        
        // console.log('PluginTransactionUtils: Helpers hashed', {
        //     resultLength: result.length
        // });

        return result;
    };
}

export const pluginTransactionUtils = new PluginTransactionUtils();