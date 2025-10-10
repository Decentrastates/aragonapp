import { CreateDaoSlotId } from '@/modules/createDao/constants/moduleSlots';
import { pluginRegistryUtils } from '@/shared/utils/pluginRegistryUtils';
import { icoPlugin } from './constants/icoPlugin';
import { IcoSetupGovernance } from './components/icoSetupGovernance';
import { IcoSetupMembership } from './components/icoSetupMembership';
import { icoBodyUtils } from './utils/icoBodyUtils';
import { useIcoActions } from './hooks/useIcoActions';
import { useIcoMemberStats } from './hooks/useIcoMemberStats';

// 插件初始化函数
export const initialiseIcoPlugin = () => {
    pluginRegistryUtils
        // Plugin definitions
        .registerPlugin(icoPlugin)
        
        // Governance module slots
        .registerSlotFunction({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_MEMBERSHIP,
            pluginId: icoPlugin.id,
            function: useIcoActions,
        })
        .registerSlotFunction({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_GOVERNANCE,
            pluginId: icoPlugin.id,
            function: useIcoMemberStats,
        })
        
        // Settings module slots
        .registerSlotFunction({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_MEMBERSHIP,
            pluginId: icoPlugin.id,
            function: icoBodyUtils.pluginToFormData,
        })
        
        // Create DAO module slots
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_MEMBERSHIP,
            pluginId: icoPlugin.id,
            component: IcoSetupMembership,
        })
        .registerSlotComponent({
            slotId: CreateDaoSlotId.CREATE_DAO_SETUP_GOVERNANCE,
            pluginId: icoPlugin.id,
            component: IcoSetupGovernance,
        });
};

// 导出API服务
export * from './api';

export default {
    id: icoPlugin.id,
    name: icoPlugin.name,
    description: icoPlugin.setup?.descriptionKey ?? 'ICO Plugin',
};