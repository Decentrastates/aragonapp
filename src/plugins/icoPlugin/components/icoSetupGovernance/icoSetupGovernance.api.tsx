import type { IPluginSetupGovernanceParams } from '@/modules/createDao/types';

export interface IIcoSetupGovernanceForm {
    // ICO特定的治理设置
}

export interface IIcoSetupGovernanceMembershipSettings {
    // ICO特定的成员资格设置
    token: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
    };
}

export interface IIcoSetupGovernanceProps extends Omit<IPluginSetupGovernanceParams, 'membershipSettings'> {
    /**
     * Membership settings of the ICO body.
     */
    membershipSettings: IIcoSetupGovernanceMembershipSettings;
}