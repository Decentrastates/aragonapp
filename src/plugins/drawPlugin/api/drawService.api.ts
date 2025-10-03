// API request/response types
import type { 
    DrawEligibility, 
    DrawHistoryItem, 
    NftHolding, 
    RedemptionRequirement, 
    DrawResult, 
    NftRedemption,
    NftCombo
} from './drawService/domain';

export interface ICheckEligibilityRequest {
    daoAddress: string;
    userAddress: string;
}

export interface ICheckEligibilityResponse extends DrawEligibility {}

export interface IGetDrawHistoryRequest {
    daoAddress: string;
    userAddress: string;
    page: number;
    limit: number;
}

export interface IGetDrawHistoryResponse {
    items: DrawHistoryItem[];
    total: number;
}

export interface IGetNftHoldingsRequest {
    daoAddress: string;
    userAddress: string;
}

export interface IGetNftHoldingsResponse {
    items: NftHolding[];
}

export interface IGetRedemptionRequirementsRequest {
    daoAddress: string;
}

export interface IGetRedemptionRequirementsResponse {
    items: RedemptionRequirement[];
}

export interface IRequestDrawRequest {
    daoAddress: string;
    userAddress: string;
}

export interface IRequestDrawResponse extends DrawResult {}

export interface IRedeemNftsRequest {
    daoAddress: string;
    userAddress: string;
    nftIds: string[];
}

export interface IRedeemNftsResponse extends NftRedemption {}

export interface IGetPluginSettingsRequest {
    daoAddress: string;
}

export interface IGetPluginSettingsResponse {
    tokenA: string;
    tokenB: string;
    eligibleToken: string;
    minTokenAmount: string;
    isErc1155Eligible: boolean;
    eligibleNftId: string;
    drawInterval: string;
    nftCombos: NftCombo[];
}

// Additional interfaces for Draw Plugin management
export interface IUpdateEligibilityParamRequest {
    daoAddress: string;
    pluginAddress: string;
    paramName: string;
    newValue: string;
}

export interface IUpdateEligibilityParamResponse {
    success: boolean;
    transactionHash?: string;
}

export interface IUpdateBlacklistRequest {
    daoAddress: string;
    pluginAddress: string;
    users: string[];
    isBlacklisted: boolean;
}

export interface IUpdateBlacklistResponse {
    success: boolean;
    transactionHash?: string;
}

export interface IUpdateNFTComboRequest {
    daoAddress: string;
    pluginAddress: string;
    comboId: string;
    isEnabled: boolean;
    maxSingleBatch: string;
    maxExchangeCount: string;
}

export interface IUpdateNFTComboResponse {
    success: boolean;
    transactionHash?: string;
}

export interface ISetNFTMaxSupplyRequest {
    daoAddress: string;
    pluginAddress: string;
    nftId: string;
    maxSupply: string;
}

export interface ISetNFTMaxSupplyResponse {
    success: boolean;
    transactionHash?: string;
}

export interface IGetValidNftIdsRequest {
    daoAddress: string;
    pluginAddress: string;
}

export interface IGetValidNftIdsResponse {
    ids: string[];
}

export interface IGetNftSupplyRequest {
    daoAddress: string;
    pluginAddress: string;
    nftId: string;
}

export interface IGetNftSupplyResponse {
    current: string;
    max: string;
}

// API service interface
export interface IDrawServiceApi {
    /**
     * Check if user is eligible for drawing
     */
    checkEligibility: (params: ICheckEligibilityRequest) => Promise<ICheckEligibilityResponse>;
    
    /**
     * Get user's draw history
     */
    getDrawHistory: (params: IGetDrawHistoryRequest) => Promise<IGetDrawHistoryResponse>;
    
    /**
     * Get user's NFT holdings
     */
    getNftHoldings: (params: IGetNftHoldingsRequest) => Promise<IGetNftHoldingsResponse>;
    
    /**
     * Get redemption requirements
     */
    getRedemptionRequirements: (params: IGetRedemptionRequirementsRequest) => Promise<IGetRedemptionRequirementsResponse>;
    
    /**
     * Request a draw
     */
    requestDraw: (params: IRequestDrawRequest) => Promise<IRequestDrawResponse>;
    
    /**
     * Redeem NFTs for tokens
     */
    redeemNfts: (params: IRedeemNftsRequest) => Promise<IRedeemNftsResponse>;
    
    /**
     * Get plugin settings
     */
    getPluginSettings: (params: IGetPluginSettingsRequest) => Promise<IGetPluginSettingsResponse>;
    
    /**
     * Update eligibility parameter
     */
    updateEligibilityParam: (params: IUpdateEligibilityParamRequest) => Promise<IUpdateEligibilityParamResponse>;
    
    /**
     * Update blacklist
     */
    updateBlacklist: (params: IUpdateBlacklistRequest) => Promise<IUpdateBlacklistResponse>;
    
    /**
     * Update NFT combo
     */
    updateNFTCombo: (params: IUpdateNFTComboRequest) => Promise<IUpdateNFTComboResponse>;
    
    /**
     * Set NFT max supply
     */
    setNFTMaxSupply: (params: ISetNFTMaxSupplyRequest) => Promise<ISetNFTMaxSupplyResponse>;
    
    /**
     * Get valid NFT IDs
     */
    getValidNftIds: (params: IGetValidNftIdsRequest) => Promise<IGetValidNftIdsResponse>;
    
    /**
     * Get NFT supply
     */
    getNftSupply: (params: IGetNftSupplyRequest) => Promise<IGetNftSupplyResponse>;
}