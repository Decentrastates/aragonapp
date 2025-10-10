import type { IPluginSettings } from '@/shared/api/daoService';

export interface IcoToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface TradingPair {
  id: string;
  inputToken: IcoToken; // 用户用来购买的资产
  outputToken: IcoToken; // DAO 的治理资产
  exchangeRate: number; // 兑换比率 (1 inputToken = exchangeRate outputToken)
}

export interface SalesBatch {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  tradingPair: TradingPair;
  totalLimit: number; // 总限额
  userLimit: number; // 用户单次购买限额
  soldAmount: number; // 已售出数量
  isActive: boolean;
}

export interface PurchaseRecord {
  id: string;
  userId: string;
  batchId: string;
  amount: number; // 购买数量
  timestamp: Date;
  transactionHash: string;
}

export interface IcoPluginConfig {
  daoAddress: string;
  batches: SalesBatch[];
  totalSold: number;
  totalLimit: number; // ICO 合约销售治理资产的总限额
}

export interface IcoPluginSettings extends IPluginSettings {
  // ICO插件设置
  config: IcoPluginConfig;
}