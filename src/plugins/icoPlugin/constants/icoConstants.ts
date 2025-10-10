import { SalesBatch, TradingPair } from '../types/icoTypes';

export const DEFAULT_SALES_BATCH = (): Partial<SalesBatch> => ({
  name: '',
  description: '',
  startTime: new Date(),
  endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 默认30天后结束
  totalLimit: 1000000,
  userLimit: 10000,
  soldAmount: 0,
  isActive: false,
});

export const DEFAULT_TRADING_PAIR = (): Partial<TradingPair> => ({
  exchangeRate: 1, // 默认1:1兑换
});

export const ICO_PLUGIN_ID = 'ico-plugin';
export const ICO_PLUGIN_NAME = 'ICO Plugin';
export const ICO_PLUGIN_DESCRIPTION = 'Manage ICO sales batches, trading pairs and exchange rates for DAO governance tokens';

// 错误消息
export const ERROR_MESSAGES = {
  BATCH_NOT_ACTIVE: 'Sales batch is not active',
  BATCH_ENDED: 'Sales batch has ended',
  BATCH_NOT_STARTED: 'Sales batch has not started yet',
  EXCEEDS_USER_LIMIT: 'Purchase amount exceeds user limit',
  EXCEEDS_BATCH_LIMIT: 'Purchase amount exceeds batch limit',
  EXCEEDS_TOTAL_LIMIT: 'Purchase amount exceeds total ICO limit',
  INVALID_AMOUNT: 'Invalid purchase amount',
};