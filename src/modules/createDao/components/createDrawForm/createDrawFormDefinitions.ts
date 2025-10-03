import { type ISetupBodyForm } from "@/modules/createDao/dialogs/setupBodyDialog/setupBodyDialogDefinitions";
// import { type ISetupStageSettingsForm } from "@/modules/createDao/dialogs/setupStageSettingsDialog";
import { type IResourcesInputResource } from "@/shared/components/forms/resourcesInput";

export enum DrawCreationMode {
    LISTED_BODIES = 'LISTED_BODIES',
    ANY_WALLET = 'ANY_WALLET',
}

export enum DrawStageType {
    NORMAL = 'NORMAL',
    OPTIMISTIC = 'OPTIMISTIC',
}

export enum DrawType {
    BASIC = 'BASIC',
    ADVANCED = 'ADVANCED',
}

export enum DrawPermission {
    ANY = 'ANY',
    SELECTED = 'SELECTED',
}

// Base interface for all create draw forms
export interface ICreateDrawFormDataBase {
    /**
     * Name of the process.
     */
    name: string;
    /**
     * Key of the process used as prefix for proposals.
     */
    processKey?: string;
    /**
     * Description of the process.
     */
    description: string;
    /**
     * Resources of the process.
     */
    resources: IResourcesInputResource[];
}

// NFT unit within a combination
export interface INftComboUnit {
    /**
     * NFT ID
     */
    id: string;
    /**
     * Number of this NFT ID required per exchange
     */
    unit: string;
}

// NFT combination for exchange
export interface INftCombo {
    /**
     * Combination ID
     */
    comboId: string;
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
    maxExchangeCount: string;
    /**
     * Maximum number of combinations that can be exchanged in a single batch
     */
    maxSingleBatch: string;
    /**
     * Current exchange count for this combination
     */
    currentExchangeCount: string;
}

// Common fields for draw functionality
export interface IDrawCommonFields {
    // Token settings
    /**
     * ERC20 token address for the draw plugin.
     * Set to address(0) to deploy a new token.
     */
    tokenA?: string;
    /**
     * ERC1155 token address for the draw plugin.
     * Set to address(0) to deploy a new token.
     */
    tokenB?: string;
    
    // Eligibility settings
    /**
     * Token address used for eligibility verification
     */
    eligibleToken?: string;
    /**
     * Minimum token holding requirement
     */
    minTokenAmount?: string;
    /**
     * Whether ERC1155 tokens are used for eligibility
     */
    isErc1155Eligible?: boolean;
    /**
     * ERC1155 token ID (required if isErc1155Eligible is true)
     */
    eligibleNftId?: string;
    /**
     * Draw interval in seconds
     */
    drawInterval?: string;
    
    /**
     * NFT combinations for exchange
     */
    nftCombos?: INftCombo[];
}

// Extended fields for step-by-step form
export interface IDrawExtendedFields extends IDrawCommonFields {
    // Custom token settings
    /**
     * Whether to use a custom token A address for swap rules
     */
    useCustomTokenA?: boolean;
    /**
     * Custom token A address for swap rules (if useCustomTokenA is true)
     */
    customTokenA?: string;
    /**
     * Whether to use a custom eligible token
     */
    useCustomEligibleToken?: boolean;
    
    // NFT creation fields
    /**
     * Whether to create a new NFT
     */
    isCreateNewNft?: boolean;
    /**
     * ERC1155 token URI (used only when deploying a new token)
     */
    erc1155Uri?: string;
    
    // Token creation fields
    /**
     * Whether to create a new token
     */
    isCreateNewToken?: boolean;
    /**
     * ERC20 token name (used only when deploying a new token)
     */
    tokenName?: string;
    /**
     * ERC20 token symbol (used only when deploying a new token)
     */
    tokenSymbol?: string;
    /**
     * Token decimals
     */
    tokenDecimals?: string;
    /**
     * Token initial supply
     */
    tokenInitialSupply?: string;
}

export interface INftAttribute {
    /**
     * The type of trait
     */
    trait_type: string;
    /**
     * The value of the trait
     */
    value: string | number;
    /**
     * Display type for numeric values
     */
    display_type?: 'number';
}

export interface ITokenMetadata {
    /**
     * Name of the token
     */
    name: string;
    /**
     * Symbol of the token
     */
    symbol: string;
    /**
     * Decimals of the token
     */
    decimals: number;
}

export interface INftMetadata {
    /**
     * Name of the NFT
     */
    name: string;
    /**
     * Description of the NFT
     */
    description: string;
    /**
     * IPFS URI for the NFT image (ipfs://{cid})
     */
    image: string;
    /**
     * A URL to a multi-media attachment for the item. The file extensions GLTF, GLB, WEBM, MP4, M4V, OGV, and OGG are supported, along with the audio-only extensions MP3, WAV, and OGA.
     * Animation_url also supports HTML pages, allowing you to build rich experiences and interactive NFTs using JavaScript canvas, WebGL, and more. Scripts and relative paths within the HTML page are now supported. However, access to browser extensions is not supported.
     */
    animation_url?: string;
    /**
     * This is the URL that will appear below the asset's image on OpenSea and will allow users to leave OpenSea and view the item on your site.
     */
    external_url?: string;
    /**
     * Background color of the item on OpenSea. Must be a six-character hexadecimal without a pre-pended #.
     */
    background_color?: string;
    /**
     * Maximum supply of this NFT
     */
    supply?: number;
    /**
     * Attributes of the NFT
     */
    attributes: INftAttribute[];
}

// Main draw form interface
export interface ICreateDrawForm extends ICreateDrawFormDataBase {
    /**
     * Governance settings for the draw plugin
     */
    governance: IDrawExtendedFields;
}

export type ICreateDrawFormData = ICreateDrawForm;

export interface ICreateDrawFormStage {
    /**
     * Internal ID of the stage used as reference for bodies.
     */
    internalId: string;
    /**
     * Name of the stage.
     */
    name: string;
    /**
     * List of bodies of the stage.
     */
    bodies: ISetupBodyForm[];
    /**
     * Settings of the stage.
     */
    // settings: ISetupStageSettingsForm;
}