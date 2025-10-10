import type { IResourcesInputResource } from '@/shared/components/forms/resourcesInput';
import type { ICompositeAddress } from '@cddao/gov-ui-kit';
import type { BodyType } from '../../types/enum';

export interface IAppsSetupBodyFormBase {
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
}

export interface IAppsSetupBodyFormNew<TErc20 = unknown, TErc1155 = unknown, TDraw = unknown>
    extends IAppsSetupBodyFormBase {
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
    erc20: TErc20;
    /**
     * 主体的插件特定成员资格设置。
     */
    erc1155: TErc1155;

    draw: TDraw;
}

export interface IAppsSetupBodyFormExternal extends IAppsSetupBodyFormBase, ICompositeAddress {
    /**
     * 外部主体类型。
     */
    type: BodyType.EXTERNAL;
    /**
     * 给定地址是否为Safe多重签名地址。
     */
    isSafe: boolean;
}

export interface IAppsSetupBodyFormExisting<TErc20 = unknown, TErc1155 = unknown, TDraw = unknown>
    extends IAppsSetupBodyFormBase,
        Pick<
            IAppsSetupBodyFormNew<TErc20, TErc1155, TDraw>,
            'description' | 'resources' | 'erc20' | 'erc1155' | 'draw'
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

export type IAppsSetupBodyForm<TErc20 = unknown, TErc1155 = unknown, TDraw = unknown> =
    | IAppsSetupBodyFormNew<TErc20, TErc1155, TDraw>
    | IAppsSetupBodyFormExisting<TErc20, TErc1155, TDraw>
