/**
 * ICO插件计算工具类
 * 提供与ICO插件相关的计算函数
 */
import { type SalesBatch } from '../../types/icoTypes';

/**
 * 计算可购买的最大数量
 */
export const calculateMaxPurchaseAmount = (batch: SalesBatch, userPreviousPurchases = 0) => {
  // 用户剩余可购买量
  const userRemaining = batch.userLimit - userPreviousPurchases;
  
  // 批次剩余可销售量
  const batchRemaining = batch.totalLimit - batch.soldAmount;
  
  // ICO 总剩余量
  // 注意：这里需要访问 ICO 插件的总限额配置
  
  return Math.min(userRemaining, batchRemaining);
};

/**
 * 计算兑换数量
 */
export const calculateExchangeAmount = (amount: number, exchangeRate: number): number => {
  return amount * exchangeRate;
};

/**
 * 格式化代币数量 (考虑小数位数)
 */
export const formatTokenAmount = (amount: number, decimals: number): string => {
  return (amount / Math.pow(10, decimals)).toFixed(decimals);
};

/**
 * 解析代币数量 (考虑小数位数)
 */
export const parseTokenAmount = (amount: string, decimals: number): number => {
  return Math.floor(parseFloat(amount) * Math.pow(10, decimals));
};