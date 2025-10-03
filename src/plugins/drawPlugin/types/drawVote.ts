import type { IVote } from '@/modules/governance/api/governanceService';

export interface IDrawVote extends IVote {
    /**
     * Participation status in the draw.
     */
    isParticipating: boolean;
    /**
     * Timestamp of participation.
     */
    participationTimestamp: number;
    /**
     * Entry count for the draw.
     */
    entryCount: number;
}