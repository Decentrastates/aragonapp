import type { IPluginSetupMembershipParams } from '@/modules/createDao/types';
import type { Network } from '@/shared/api/daoService';

export interface IDrawPluginSetupDrawProps extends IPluginSetupMembershipParams {
    /**
     * When true show a read only mode of the address field.
     */
    disabled?: boolean;
    /**
     * Callback to be used when the add button is clicked.
     */
    onAddClick?: () => void;
    /**
     * Address of the plugin, used to validate if the entered user address is already a member of the plugin.
     */
    pluginAddress?: string;
    /**
     * Network of the plugin.
     */
    network?: Network;
    /**
     * Hides the field label and help-text when set to true.
     */
    hideLabel?: boolean;
    /**
     * ID of the DAO to fetch assets from.
     */
    daoId?: string;
}

export interface IDrawPluginSetupDrawForm {
    /**
     * Draw plugin configuration fields.
     */
    // 这里将包含抽奖插件的配置字段
    // tokenA?: string;
    // tokenB?: string;
    eligibleToken?: string;
    minTokenAmount?: number;
    isErc1155Eligible?: boolean;
    eligibleNftId?: number;
    drawInterval?: number;
    initNFTCombos?: IErc1155Combo;
}


// 用于兑换的NFT组合
export interface IErc1155Combo {
    /**
     * 组合ID
     */
    comboId: number;
    /**
     * 此组合中的NFT单元数组
     */
    erc1155Units: IErc1155ComboUnit[];
    /**
     * 此组合是否启用
     */
    isEnabled: boolean;
    /**
     * 此组合的最大总兑换次数
     */
    maxExchangeCount: number;
    /**
     * 单次批次中可兑换的最大组合数
     */
    maxSingleBatch: number;
    /**
     * 此组合的当前兑换次数
     */
    currentExchangeCount: number;
}

// 组合中的NFT单元
export interface IErc1155ComboUnit {
    /**
     * NFT ID
     */
    id: number;
    /**
     * 每次兑换所需的此NFT ID数量
     */
    unit: number;
}