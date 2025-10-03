'use client';

import type { INormalizeActionsParams } from '@/modules/governance/types';

export interface IUseDrawNormalizeActionsParams extends INormalizeActionsParams {}

export const useDrawNormalizeActions = (params: IUseDrawNormalizeActionsParams) => {
    const { actions } = params;

    return actions.map((action) => {
        // For draw plugin, we don't have specific action types to normalize like token plugin does
        // But we can add any draw-specific action normalization logic here if needed in the future
        
        // For now, we just return the action as is
        return action;
    });
};