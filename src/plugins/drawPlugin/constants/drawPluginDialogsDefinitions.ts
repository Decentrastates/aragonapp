import type { IDialogComponentDefinitions } from '@/shared/components/dialogProvider';
import { DrawParticipateDialog } from '../dialogs/drawParticipateDialog/index';
import { DrawRedeemDialog } from '../dialogs/drawRedeemDialog/index';
import { DrawPluginDialogId } from './drawPluginDialogId';

export const drawPluginDialogsDefinitions: Record<DrawPluginDialogId, IDialogComponentDefinitions> = {
    [DrawPluginDialogId.PARTICIPATE_DRAW]: { Component: DrawParticipateDialog },
    [DrawPluginDialogId.DRAW_HISTORY]: { Component: () => null }, // Placeholder for draw history dialog
    [DrawPluginDialogId.REDEEM_REWARDS]: { Component: DrawRedeemDialog },
    [DrawPluginDialogId.APPROVE_NFT]: { Component: () => null } // Placeholder for approve NFT dialog
};