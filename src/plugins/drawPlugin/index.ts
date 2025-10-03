import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
import { GovernanceSlotId } from '@/modules/governance/constants/moduleSlots';
import { SettingsSlotId } from '@/modules/settings/constants/moduleSlots';
import { pluginRegistryUtils } from '@/shared/utils/pluginRegistryUtils';
import { drawPlugin } from './constants/drawPlugin';
import { DrawPluginSlotId } from './constants/drawPluginSlotId';
import { DRAW_PLUGIN_SUBDOMAIN, DRAW_PLUGIN_ID } from './constants/drawPluginConstants';
import { DrawCreateProposalSettingsForm } from './components/drawCreateProposalSettingsForm';
import { DrawProposalListItem } from './components/drawProposalListItem';
import { DrawVotingTerminal } from './components/drawVotingTerminal';
import { drawTransactionUtils, drawProposalUtils } from './utils';
import { useDrawActions } from './hooks/useDrawActions';
import { useDrawPermissionCheckProposalCreation } from './hooks/useDrawPermissionCheckProposalCreation';
import { useDrawGovernanceSettings } from './hooks/useDrawGovernanceSettings';

// 添加更多组件和hooks的导入
import { DrawSettingsPanel } from './components/drawSettingsPanel';
import { DrawMemberList } from './components/drawMemberList';
import { DrawMemberPanel } from './components/drawMemberPanel';
import { DrawProposalVotingBreakdown } from './components/drawProposalVotingBreakdown';
import { DrawSubmitVote } from './components/drawSubmitVote';
import { DrawVoteList } from './components/drawVoteList';
import { DrawProposalVotingSummary } from './components/drawProposalVotingSummary';
import { DrawMemberInfo } from './components/drawMemberInfo';
import { DrawGovernanceInfo } from './components/drawGovernanceInfo';
import { DrawProcessBodyField } from './components/drawProcessBodyField';
import { DrawProposalCreationSettings } from './components/drawProposalCreationSettings';
import { useDrawPermissionCheckVoteSubmission } from './hooks/useDrawPermissionCheckVoteSubmission/useDrawPermissionCheckVoteSubmission';
import { useDrawNormalizeActions } from './hooks/useDrawNormalizeActions/useDrawNormalizeActions';

import { DrawWidget } from './components/drawWidget';
import type { INavigationLink } from '@/shared/components/navigation';
import { IconType } from '@cddao/gov-ui-kit';




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
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_PROCESS_BODY_READ_FIELD,
            pluginId: drawPlugin.id,
            component: DrawProcessBodyField,
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_PROPOSAL_CREATION_SETTINGS,
            pluginId: drawPlugin.id,
            component: DrawProposalCreationSettings,
        })
        
        // Governance module slots - 添加创建提案数据构建函数和设置表单组件
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_BUILD_CREATE_PROPOSAL_DATA,
            pluginId: drawPlugin.id,
            function: drawTransactionUtils.buildCreateProposalData,
        })
        .registerSlotComponent({
            slotId: GovernanceSlotId.GOVERNANCE_CREATE_PROPOSAL_SETTINGS_FORM,
            pluginId: drawPlugin.id,
            component: DrawCreateProposalSettingsForm,
        })
        .registerSlotComponent({
            slotId: GovernanceSlotId.GOVERNANCE_PROPOSAL_VOTING_TERMINAL,
            pluginId: drawPlugin.id,
            component: DrawVotingTerminal,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_PROCESS_PROPOSAL_STATUS,
            pluginId: drawPlugin.id,
            function: drawProposalUtils.getProposalStatus,
        })
        .registerSlotComponent({
            slotId: GovernanceSlotId.GOVERNANCE_DAO_PROPOSAL_LIST_ITEM,
            pluginId: drawPlugin.id,
            component: DrawProposalListItem,
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
        // 添加缺失的治理插槽
        .registerSlotComponent({
            slotId: GovernanceSlotId.GOVERNANCE_DAO_MEMBER_LIST,
            pluginId: drawPlugin.id,
            component: DrawMemberList,
        })
        .registerSlotComponent({
            slotId: GovernanceSlotId.GOVERNANCE_MEMBER_PANEL,
            pluginId: drawPlugin.id,
            component: DrawMemberPanel,
        })
        .registerSlotComponent({
            slotId: GovernanceSlotId.GOVERNANCE_PROPOSAL_VOTING_BREAKDOWN,
            pluginId: drawPlugin.id,
            component: DrawProposalVotingBreakdown,
        })
        .registerSlotComponent({
            slotId: GovernanceSlotId.GOVERNANCE_VOTE_LIST,
            pluginId: drawPlugin.id,
            component: DrawVoteList,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_PROCESS_PROPOSAL_SUCCEEDED,
            pluginId: drawPlugin.id,
            function: () => true, // 简化实现
        })
        .registerSlotComponent({
            slotId: GovernanceSlotId.GOVERNANCE_SUBMIT_VOTE,
            pluginId: drawPlugin.id,
            component: DrawSubmitVote,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_BUILD_VOTE_DATA,
            pluginId: drawPlugin.id,
            function: drawTransactionUtils.buildVoteData,
        })
        .registerSlotFunction({
            slotId: GovernanceSlotId.GOVERNANCE_PLUGIN_NORMALIZE_ACTIONS,
            pluginId: drawPlugin.id,
            function: useDrawNormalizeActions,
        })
        .registerSlotComponent({
            slotId: GovernanceSlotId.GOVERNANCE_PROPOSAL_VOTING_MULTI_BODY_SUMMARY,
            pluginId: drawPlugin.id,
            component: DrawProposalVotingSummary,
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
        .registerSlotComponent({
            slotId: SettingsSlotId.SETTINGS_PANEL,
            pluginId: drawPlugin.id,
            component: DrawSettingsPanel,
        })
        .registerSlotComponent({
            slotId: SettingsSlotId.SETTINGS_MEMBERS_INFO,
            pluginId: drawPlugin.id,
            component: DrawMemberInfo,
        })
        .registerSlotComponent({
            slotId: SettingsSlotId.SETTINGS_GOVERNANCE_INFO,
            pluginId: drawPlugin.id,
            component: DrawGovernanceInfo,
        })
        .registerSlotFunction({
            slotId: SettingsSlotId.SETTINGS_BUILD_PREPARE_PLUGIN_UPDATE_DATA,
            pluginId: drawPlugin.id,
            function: drawTransactionUtils.buildPrepareUpdateData,
        })
        .registerSlotComponent({
            slotId: DrawPluginSlotId.DRAW_WIDGET,
            pluginId: drawPlugin.id,
            component: DrawWidget,
        })
        .registerSlotFunction({
            slotId: DrawPluginSlotId.DRAW_MAIN_PAGE,
            pluginId: drawPlugin.id,
            function: (baseUrl: string): INavigationLink[] => [
                {
                    label: 'app.plugins.draw.navigation.main',
                    link: `${baseUrl}/draw/main`,
                    icon: IconType.DRAW,
                },
                {
                    label: 'app.plugins.draw.navigation.history',
                    link: `${baseUrl}/draw/history`,
                    icon: IconType.PERSON,
                },
                {
                    label: 'app.plugins.draw.navigation.rewards',
                    link: `${baseUrl}/draw/rewards`,
                    icon: IconType.PERSON,
                }
            ],
        });
        
    return pluginRegistryUtils;
};

// Export constants
export { DRAW_PLUGIN_SUBDOMAIN, DRAW_PLUGIN_ID };
