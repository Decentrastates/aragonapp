import type {
    ICheckEligibilityRequest,
    ICheckEligibilityResponse,
    IGetDrawHistoryRequest,
    IGetDrawHistoryResponse,
    IGetNftHoldingsRequest,
    IGetNftHoldingsResponse,
    IGetRedemptionRequirementsRequest,
    IGetRedemptionRequirementsResponse,
    IRequestDrawRequest,
    IRequestDrawResponse,
    IRedeemNftsRequest,
    IRedeemNftsResponse,
    IGetPluginSettingsRequest,
    IGetPluginSettingsResponse,
    IGetValidNftIdsRequest,
    IGetValidNftIdsResponse,
    IGetNftSupplyRequest,
    IGetNftSupplyResponse,
} from './drawService.api';

// Mock data
const mockEligibilityData: ICheckEligibilityResponse = {
    isEligible: true,
    tokenBalance: '150',
    lastDrawTimestamp: Date.now() - 86400000, // 1天前
    nextEligibleTimestamp: Date.now() + 86400000, // 1天后
    reason: 'Eligible for drawing'
};

const mockHistoryData: IGetDrawHistoryResponse = {
    items: [
        {
            id: '1',
            timestamp: Date.now() - 86400000,
            rewardType: 'NFT',
            rewardId: 'NFT-001',
            status: 'completed'
        },
        {
            id: '2',
            timestamp: Date.now() - 172800000,
            rewardType: 'Token',
            rewardId: 'TOKEN-001',
            status: 'completed'
        }
    ],
    total: 2
};

const mockNftHoldingsData: IGetNftHoldingsResponse = {
    items: [
        {
            id: 'NFT-001',
            name: 'Rare NFT',
            quantity: 2,
            metadataUri: 'https://example.com/nft/001'
        },
        {
            id: 'NFT-002',
            name: 'Common NFT',
            quantity: 5,
            metadataUri: 'https://example.com/nft/002'
        }
    ]
};

const mockRedemptionRequirementsData: IGetRedemptionRequirementsResponse = {
    items: [
        {
            nftId: 'NFT-001',
            requiredQuantity: 1,
            isMet: true
        },
        {
            nftId: 'NFT-002',
            requiredQuantity: 3,
            isMet: false
        }
    ]
};

const mockPluginSettingsData: IGetPluginSettingsResponse = {
    tokenA: '0x1234567890123456789012345678901234567890',
    tokenB: '0x0987654321098765432109876543210987654321',
    eligibleToken: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    minTokenAmount: '100',
    isErc1155Eligible: true,
    eligibleNftId: '1',
    drawInterval: '86400', // 24 hours
    nftCombos: [
        {
            comboId: 'combo-1',
            nftUnits: [
                { id: 'NFT-001', unit: '1' },
                { id: 'NFT-002', unit: '2' }
            ],
            isEnabled: true,
            maxExchangeCount: '100',
            maxSingleBatch: '10',
            currentExchangeCount: '5'
        }
    ]
};

const mockValidNftIdsData: IGetValidNftIdsResponse = {
    ids: ['1', '2', '3', '4', '5']
};

const mockNftSupplyData: IGetNftSupplyResponse = {
    current: '50',
    max: '100'
};

// Mock API service implementation
export class MockDrawApiService {
    /**
     * Check if user is eligible for drawing
     */
    checkEligibility = async (params: ICheckEligibilityRequest): Promise<ICheckEligibilityResponse> => {
        // 使用 params 参数以避免 ESLint 错误
        void params;
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockEligibilityData;
    };
    
    /**
     * Get user's draw history
     */
    getDrawHistory = async (params: IGetDrawHistoryRequest): Promise<IGetDrawHistoryResponse> => {
        // 使用 params 参数以避免 ESLint 错误
        void params;
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockHistoryData;
    };
    
    /**
     * Get user's NFT holdings
     */
    getNftHoldings = async (params: IGetNftHoldingsRequest): Promise<IGetNftHoldingsResponse> => {
        // 使用 params 参数以避免 ESLint 错误
        void params;
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockNftHoldingsData;
    };
    
    /**
     * Get redemption requirements
     */
    getRedemptionRequirements = async (params: IGetRedemptionRequirementsRequest): Promise<IGetRedemptionRequirementsResponse> => {
        // 使用 params 参数以避免 ESLint 错误
        void params;
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockRedemptionRequirementsData;
    };
    
    /**
     * Request a draw
     */
    requestDraw = async (params: IRequestDrawRequest): Promise<IRequestDrawResponse> => {
        // 使用 params 参数以避免 ESLint 错误
        void params;
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            drawId: `draw-${String(Date.now())}`,
            isWinner: Math.random() > 0.5,
            rewardType: 'NFT',
            rewardAmount: '1',
            transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`
        };
    };
    
    /**
     * Redeem NFTs for tokens
     */
    redeemNfts = async (params: IRedeemNftsRequest): Promise<IRedeemNftsResponse> => {
        // 使用 params 参数以避免 ESLint 错误
        void params;
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
            amount: '100'
        };
    };
    
    /**
     * Get plugin settings
     */
    getPluginSettings = async (params: IGetPluginSettingsRequest): Promise<IGetPluginSettingsResponse> => {
        // 使用 params 参数以避免 ESLint 错误
        void params;
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockPluginSettingsData;
    };
    
    /**
     * Get valid NFT IDs
     */
    getValidNftIds = async (params: IGetValidNftIdsRequest): Promise<IGetValidNftIdsResponse> => {
        // 使用 params 参数以避免 ESLint 错误
        void params;
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockValidNftIdsData;
    };
    
    /**
     * Get NFT supply
     */
    getNftSupply = async (params: IGetNftSupplyRequest): Promise<IGetNftSupplyResponse> => {
        // 使用 params 参数以避免 ESLint 错误
        void params;
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockNftSupplyData;
    };
}
