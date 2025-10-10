'use client';

import type { IDaoPlugin } from '@/shared/api/daoService';
import type { IcoPluginSettings } from '../../types/icoTypes';

export const useIcoMemberStats = (plugin: IDaoPlugin<IcoPluginSettings>) => {
    // ICO成员统计逻辑
    return {
        totalParticipants: 0,
        totalPurchases: 0,
        totalAmount: 0,
    };
};