import type { IPluginSettings } from '@/shared/api/daoService';

export interface IDrawPluginSettings extends IPluginSettings {
    /**
     * 抽奖插件的ERC20代币地址
     * 设置为address(0)以部署新代币
     */
    tokenA: string;
    /**
     * ERC20代币名称
     */
    erc20Name: string;
    /**
     * ERC20代币符号
     */
    erc20Symbol: string;
    /**
     * 抽奖插件的ERC1155代币地址
     * 设置为address(0)以部署新代币
     */
    tokenB: string;
    /**
     * ERC1155代币URI
     */
    erc1155Uri: string;
    /**
     * 最低代币持有要求
     */
    minTokenAmount: number;
    /**
     * 是否使用ERC1155代币进行资格验证
     */
    isErc1155Eligible: boolean;
    /**
     * ERC1155代币ID（如果isErc1155Eligible为true则必需）
     */
    eligibleNftId?: number;
    /**
     * 抽奖间隔（秒）
     */
    drawInterval: number;
    /**
     * 用于兑换的NFT组合
     */
    initNFTCombos: IErc1155Combo;
}
/**
 * 兑换的NFT组合
 */
export interface IErc1155Combo {
    /**
     * 此组合中的NFT单位数组
     */
    erc1155Units: IErc1155ComboUnit[];
    /**
     * 此组合的最大总兑换次数
     */
    maxExchangeCount: number;
    /**
     * 单个批次中可兑换的最大组合数
     */
    maxSingleBatch: number;
    /**
     * 此组合的当前兑换次数
     */
    currentExchangeCount: number;
}
/**
 * 组合中的NFT单位
 */
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
