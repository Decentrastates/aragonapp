import type { ISetupBodyFormMembership } from '@/modules/createDao/dialogs/setupBodyDialog';
import type { IPluginSetupMembershipParams } from '@/modules/createDao/types';
import type { ICompositeAddress } from '@cddao/gov-ui-kit';

export interface IIcoSetupMembershipProps extends IPluginSetupMembershipParams {
    /**
     * ID of the DAO.
     */
    daoId: string;
}

export interface IIcoSetupMembershipForm extends ISetupBodyFormMembership<IIcoSetupMembershipMember> {
    // ICO特定的成员资格设置
}

export interface IIcoSetupMembershipMember extends ICompositeAddress {
    // ICO成员特定的属性
}