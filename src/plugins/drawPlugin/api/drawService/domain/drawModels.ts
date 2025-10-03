export interface DrawEligibility {
    isEligible: boolean;
    tokenBalance: string;
    lastDrawTimestamp: number | null;
    nextEligibleTimestamp: number | null;
    reason?: string;
}

export interface DrawHistoryItem {
    id: string;
    timestamp: number;
    rewardType: string;
    rewardId: string;
    status: 'pending' | 'completed' | 'failed';
}

export interface NftHolding {
    id: string;
    name: string;
    quantity: number;
    metadataUri: string;
}

export interface RedemptionRequirement {
    nftId: string;
    requiredQuantity: number;
    isMet: boolean;
}

export interface DrawResult {
    drawId: string;
    isWinner: boolean;
    rewardType?: string;
    rewardAmount?: string;
    transactionHash?: string;
}

export interface NftRedemption {
    transactionHash: string;
    amount: string;
}

export interface NftCombo {
    comboId: string;
    nftUnits: Array<{
        id: string;
        unit: string;
    }>;
    isEnabled: boolean;
    maxExchangeCount: string;
    maxSingleBatch: string;
    currentExchangeCount: string;
}