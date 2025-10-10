/**
 * ICO插件验证工具类
 * 提供与ICO插件相关的验证函数
 */
import { type SalesBatch } from '../../types/icoTypes';
import { ERROR_MESSAGES } from '../../constants/icoConstants';

/**
 * 检查销售批次是否处于活动状态
 */
export const isBatchActive = (batch: SalesBatch): boolean => {
  const now = new Date();
  return batch.isActive && 
         now >= batch.startTime && 
         now <= batch.endTime &&
         batch.soldAmount < batch.totalLimit;
};

/**
 * 验证购买请求
 */
export const validatePurchase = (
  batch: SalesBatch, 
  amount: number, 
  userPreviousPurchases = 0
): { isValid: boolean; errorMessage?: string } => {
  // 检查批次是否激活
  if (!isBatchActive(batch)) {
    return { isValid: false, errorMessage: ERROR_MESSAGES.BATCH_NOT_ACTIVE };
  }
  
  // 检查购买数量是否有效
  if (amount <= 0) {
    return { isValid: false, errorMessage: ERROR_MESSAGES.INVALID_AMOUNT };
  }
  
  // 检查是否超过用户限额
  if (userPreviousPurchases + amount > batch.userLimit) {
    return { isValid: false, errorMessage: ERROR_MESSAGES.EXCEEDS_USER_LIMIT };
  }
  
  // 检查是否超过批次限额
  if (batch.soldAmount + amount > batch.totalLimit) {
    return { isValid: false, errorMessage: ERROR_MESSAGES.EXCEEDS_BATCH_LIMIT };
  }
  
  // TODO: 检查是否超过总限额 (需要访问插件配置)
  
  return { isValid: true };
};