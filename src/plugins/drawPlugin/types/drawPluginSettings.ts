import type { IPluginSettings } from '@/shared/api/daoService';
import type { INftCombo } from './drawPluginDeployment';

export interface IDrawPluginSettings extends IPluginSettings {
    /**
     * ERC20 token address for the draw plugin.
     * Set to address(0) to deploy a new token.
     */
    tokenA: string;
    
    /**
     * ERC1155 token address for the draw plugin.
     * Set to address(0) to deploy a new token.
     */
    tokenB: string;
    
    /**
     * Token address used for eligibility verification
     */
    eligibleToken: string;
    
    /**
     * Minimum token holding requirement
     */
    minTokenAmount: bigint;
    
    /**
     * Whether ERC1155 tokens are used for eligibility
     */
    isErc1155Eligible: boolean;
    
    /**
     * ERC1155 token ID (required if isErc1155Eligible is true)
     */
    eligibleNftId?: bigint;
    
    /**
     * Draw interval in seconds
     */
    drawInterval: bigint;
    
    /**
     * NFT combinations for exchange
     */
    nftCombos: INftCombo[];
}