import type { IMember, IMemberMetrics } from '@/modules/governance/api/governanceService';

export interface IDrawMember extends Omit<IMember, 'metrics'> {
    /**
     * Type of the member.
     */
    type: 'draw';
    /**
     * Eligibility status of the member.
     */
    isEligible: boolean;
    /**
     * Token balance of the member.
     */
    tokenBalance: string | null;
    /**
     * NFT holdings of the member.
     */
    nftHoldings: Array<{
        tokenId: string;
        amount: string;
    }> | null;
    /**
     * Metrics of the member.
     */
    metrics: IMemberMetrics;
}