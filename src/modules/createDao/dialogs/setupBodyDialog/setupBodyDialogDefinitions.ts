import type { IResourcesInputResource } from '@/shared/components/forms/resourcesInput';
import type { ICompositeAddress } from '@cddao/gov-ui-kit';
import type { BodyType } from '../../types/enum';

export interface ISetupBodyFormBase {
    /**
     * 用于引用主体的内部ID。
     */
    internalId: string;
    /**
     * 要设置的主体类型。
     */
    type: BodyType;
    /**
     * 定义主体成员资格和治理设置的插件ID。
     */
    plugin: string;
    /**
     * 通用布尔值，反映内部插件特定的提案创建设置，用于验证和
     * 当插件作为SPP子插件安装时设置正确的条件规则。
     */
    canCreateProposal: boolean;
}

export interface ISetupBodyFormNew<
    TGovernance = unknown,
    TMember extends ICompositeAddress = ICompositeAddress,
    TMembership extends ISetupBodyFormMembership<TMember> = ISetupBodyFormMembership<TMember>,
> extends ISetupBodyFormBase {
    /**
     * 新主体类型。
     */
    type: BodyType.NEW;
    /**
     * 主体名称。
     */
    name: string;
    /**
     * 投票主体的可选描述。
     */
    description?: string;
    /**
     * 主体的资源。
     */
    resources: IResourcesInputResource[];
    /**
     * 主体的插件特定治理设置。
     */
    governance: TGovernance;
    /**
     * 主体的插件特定成员资格设置。
     */
    membership: TMembership;
}

export interface ISetupBodyFormExternal extends ISetupBodyFormBase, ICompositeAddress {
    /**
     * 外部主体类型。
     */
    type: BodyType.EXTERNAL;
    /**
     * 给定地址是否为Safe多重签名地址。
     */
    isSafe: boolean;
}

export interface ISetupBodyFormExisting<
    TGovernance = unknown,
    TMember extends ICompositeAddress = ICompositeAddress,
    TMembership extends ISetupBodyFormMembership<TMember> = ISetupBodyFormMembership<TMember>,
> extends ISetupBodyFormBase,
        Pick<
            ISetupBodyFormNew<TGovernance, TMember, TMembership>,
            'description' | 'resources' | 'governance' | 'membership'
        > {
    /**
     * 现有主体类型。
     */
    type: BodyType.EXISTING;
    /**
     * 现有主体的名称，对于现有的但外部的主体可以不设置。
     */
    name?: string;
    /**
     * 现有主体的地址。
     */
    address: string;
    /**
     * 现有主体的构建版本。
     */
    build?: string;
    /**
     * 现有主体的发布版本。
     */
    release?: string;
    /**
     * 主体的创建提案条件的地址。
     */
    proposalCreationConditionAddress?: string;
}

export type ISetupBodyForm<
    TGovernance = unknown,
    TMember extends ICompositeAddress = ICompositeAddress,
    TMembership extends ISetupBodyFormMembership<TMember> = ISetupBodyFormMembership<TMember>,
> =
    | ISetupBodyFormNew<TGovernance, TMember, TMembership>
    | ISetupBodyFormExisting<TGovernance, TMember, TMembership>
    | ISetupBodyFormExternal;

export interface ISetupBodyFormMembership<TMember extends ICompositeAddress = ICompositeAddress> {
    /**
     * 插件的成员。
     */
    members: TMember[];
}

