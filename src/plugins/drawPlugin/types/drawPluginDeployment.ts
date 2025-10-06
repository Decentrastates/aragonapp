/**
 * Token settings for the draw plugin deployment
 */
export interface ITokenSettings {
    /**
     * ERC20 token address, set to address(0) to deploy a new token
     */
    tokenA: string;
    
    /**
     * ERC1155 token address, set to address(0) to deploy a new token
     */
    tokenB: string;
    
    /**
     * ERC20 token name (used only when deploying a new token)
     */
    erc20Name?: string;
    
    /**
     * ERC20 token symbol (used only when deploying a new token)
     */
    erc20Symbol?: string;
    
    /**
     * ERC1155 token URI (used only when deploying a new token)
     */
    erc1155Uri?: string;
}

/**
 * NFT unit within a combination
 */
export interface INftComboUnit {
    /**
     * NFT ID
     */
    id: number;
    
    /**
     * Number of this NFT ID required per exchange
     */
    unit: number;
}

/**
 * NFT combination for exchange
 */
export interface INftCombo {
    /**
     * Combination ID
     */
    comboId: number;
    
    /**
     * Array of NFT units in this combination
     */
    nftUnits: INftComboUnit[];
    
    /**
     * Whether this combination is enabled
     */
    isEnabled: boolean;
    
    /**
     * Maximum total exchange count for this combination
     */
    maxExchangeCount: number;
    
    /**
     * Maximum number of combinations that can be exchanged in a single batch
     */
    maxSingleBatch: number;
    
    /**
     * Current exchange count for this combination
     */
    currentExchangeCount: number;
}

/**
 * Eligibility parameters for draw participation
 */
export interface IEligibilityParams {
    /**
     * Token address used for eligibility verification
     */
    eligibleToken: string;
    
    /**
     * Minimum token holding requirement
     */
    minTokenAmount: number;
    
    /**
     * Whether ERC1155 tokens are used for eligibility
     */
    isErc1155Eligible: boolean;
    
    /**
     * ERC1155 token ID (required if isErc1155Eligible is true)
     */
    eligibleNftId?: number;
    
    /**
     * Draw interval in seconds
     */
    drawInterval: number;
}

/**
 * Complete plugin installation parameters structure
 */
export interface IPluginInstallationParams {
    /**
     * Token settings
     */
    tokenSettings: ITokenSettings;
    
    /**
     * Eligibility parameters
     */
    eligibilityParams: IEligibilityParams;
    
    /**
     * Initial NFT combinations
     */
    initNFTCombos: INftCombo[];
}