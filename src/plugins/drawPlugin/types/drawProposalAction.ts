import type { IProposalAction } from '@/modules/governance/api/governanceService';

// Define action types for the draw plugin
export enum DrawProposalActionType {
    UPDATE_SETTINGS = 'UPDATE_SETTINGS',
    MINT_NFT = 'MINT_NFT',
}

export interface IDrawProposalAction extends IProposalAction {
    type: DrawProposalActionType;
}