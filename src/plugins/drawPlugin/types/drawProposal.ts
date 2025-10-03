import type { IProposal } from '@/modules/governance/api/governanceService';
import type { IDrawPluginSettings } from './drawPluginSettings';

export interface IDrawProposal extends IProposal<IDrawPluginSettings> {
    /**
     * Plugin-specific metrics of the proposal.
     */
    metrics: {
        /**
         * Total participants in the draw.
         */
        totalParticipants: number;
        /**
         * Winners of the draw.
         */
        winners: string[];
        /**
         * NFTs to be distributed.
         */
        nftsToDistribute: Array<{
            tokenId: string;
            amount: string;
        }>;
    };
}