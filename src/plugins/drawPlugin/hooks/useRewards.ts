import { useNftHoldings as useNftHoldingsService, useRedemptionRequirements as useRedemptionRequirementsService } from '../api';
import { mockNftHoldings, mockRedemptionRequirements } from '../data/mockRewardsData';

export const useNftHoldings = (daoId: string) => {
    // 直接调用服务，模拟数据逻辑在服务层处理
    const { data, isLoading, error } = useNftHoldingsService(daoId);
    
    // 如果没有数据且不处于加载状态，返回模拟数据
    const holdings = data?.items ?? (isLoading || error ? [] : mockNftHoldings);
    
    return {
        nftHoldings: holdings,
        isLoading,
        error: error,
    };
};

export const useRedemptionRequirements = (daoId: string) => {
    // 直接调用服务，模拟数据逻辑在服务层处理
    const { data, isLoading, error } = useRedemptionRequirementsService(daoId);
    
    // 如果没有数据且不处于加载状态，返回模拟数据
    const requirements = data?.items ?? (isLoading || error ? [] : mockRedemptionRequirements);
    
    return {
        requirements,
        isLoading,
        error: error,
    };
};