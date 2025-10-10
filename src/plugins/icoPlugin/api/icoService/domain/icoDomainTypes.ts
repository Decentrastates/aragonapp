// ICO插件域类型定义

export interface IIcoToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface ITradingPair {
  id: string;
  inputToken: IIcoToken; // 用户用来购买的资产
  outputToken: IIcoToken; // DAO 的治理资产
  exchangeRate: number; // 兑换比率 (1 inputToken = exchangeRate outputToken)
}

export interface IIcoBatch {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  tradingPair: ITradingPair;
  totalLimit: number; // 总限额
  userLimit: number; // 用户单次购买限额
  soldAmount: number; // 已售出数量
  isActive: boolean;
}

export interface IPurchaseRecord {
  id: string;
  userId: string;
  batchId: string;
  amount: number; // 购买数量
  timestamp: Date;
  transactionHash: string;
}

export interface IIcoConfig {
  daoAddress: string;
  batches: IIcoBatch[];
  totalSold: number;
  totalLimit: number; // ICO 合约销售治理资产的总限额
}