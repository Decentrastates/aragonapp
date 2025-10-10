import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
import { GovernanceSlotId } from '@/modules/governance/constants/moduleSlots';
import { SettingsSlotId } from '@/modules/settings/constants/moduleSlots';
import { pluginRegistryUtils } from '@/shared/utils/pluginRegistryUtils';
import { DrawPluginSetupDraw } from './components/drawPluginSetupDraw';
import { DrawPluginSetupERC1155 } from './components/drawPluginSetupERC1155';
import { DrawPluginSetupERC20 } from './components/drawPluginSetupERC20';
import { drawPlugin } from './constants/drawPlugin';
import { useDrawActions } from './hooks/useDrawActions';
import { useDrawGovernanceSettings } from './hooks/useDrawGovernanceSettings';
import { useDrawNormalizeActions } from './hooks/useDrawNormalizeActions/useDrawNormalizeActions';
import { useDrawPermissionCheckProposalCreation } from './hooks/useDrawPermissionCheckProposalCreation';
import { useDrawPermissionCheckVoteSubmission } from './hooks/useDrawPermissionCheckVoteSubmission/useDrawPermissionCheckVoteSubmission';
import { drawTransactionUtils } from './utils';
import { DrawAppsBodyField } from './components/drawAppsBodyField';

export const initialiseDrawPlugin = () => {
    pluginRegistryUtils
        // Plugin definitions
        .registerPlugin(drawPlugin)

        // Create DAO module slots - 添加插件安装准备函数
        .registerSlotFunction({
            slotId: CreateDaoSlotId.CREATE_DAO_BUILD_PREPARE_PLUGIN_INSTALL_DATA,
            pluginId: drawPlugin.id,
            function: drawTransactionUtils.buildPrepareInstallData,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_PLUGIN_ACTIONS,
            pluginId: drawPlugin.id,
            function: useDrawActions,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_PERMISSION_CHECK_PROPOSAL_CREATION,
            pluginId: drawPlugin.id,
            function: useDrawPermissionCheckProposalCreation,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_PROCESS_PROPOSAL_SUCCEEDED,
            pluginId: drawPlugin.id,
            function: () => true, // 简化实现
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_PLUGIN_NORMALIZE_ACTIONS,
            pluginId: drawPlugin.id,
            function: useDrawNormalizeActions,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_PERMISSION_CHECK_VOTE_SUBMISSION,
            pluginId: drawPlugin.id,
            function: useDrawPermissionCheckVoteSubmission,
        })

        // Settings module slots
        .registerSlotFunction({
            slotId: SettingsSlotId.SETTINGS_GOVERNANCE_SETTINGS_HOOK,
            pluginId: drawPlugin.id,
            function: useDrawGovernanceSettings,
        })
        .registerSlotFunction({
            slotId: SettingsSlotId.SETTINGS_BUILD_PREPARE_PLUGIN_UPDATE_DATA,
            pluginId: drawPlugin.id,
            function: drawTransactionUtils.buildPrepareUpdateData,
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_ERC20,
            pluginId: drawPlugin.id,
            component: DrawPluginSetupERC20,
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_ERC1155,
            pluginId: drawPlugin.id,
            component: DrawPluginSetupERC1155,
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_DRAW,
            pluginId: drawPlugin.id,
            component: DrawPluginSetupDraw,
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_APPS_BODY_READ_FIELD,
            pluginId: drawPlugin.id,
            component: DrawAppsBodyField,
        });
};
