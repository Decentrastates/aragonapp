import type { IPluginSetupGovernanceParams } from '@/modules/createDao/types';
import type { IEligibilityParams } from './drawPluginDeployment';

export interface IDrawSetupGovernanceMembershipSettings {
    /**
     * Eligibility parameters for draw participation.
     */
    eligibilityParams: IEligibilityParams;
}

export interface IDrawSetupGovernanceProps extends Omit<IPluginSetupGovernanceParams, 'membershipSettings'> {
    /**
     * Membership settings of the draw body.
     */
    membershipSettings: IDrawSetupGovernanceMembershipSettings;
}

export interface IDrawSetupGovernanceForm
    extends Pick<IEligibilityParams, 'eligibleToken' | 'minTokenAmount' | 'drawInterval'> {
    /**
     * Whether ERC1155 tokens are used for eligibility.
     */
    isErc1155Eligible: boolean;
    
    /**
     * ERC1155 token ID (required if isErc1155Eligible is true).
     */
    eligibleNftId?: string;
}