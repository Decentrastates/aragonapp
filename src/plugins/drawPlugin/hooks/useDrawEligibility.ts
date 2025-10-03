import { useDrawEligibility as useDrawEligibilityService } from '../api';

export const useDrawEligibility = (daoId: string) => {
    // 调用hook，模拟数据逻辑在服务层处理
    const { data, isLoading, error } = useDrawEligibilityService(daoId);
    
    return {
        isLoading,
        isEligible: data?.isEligible ?? false,
        eligibilityData: data,
        error,
    };
};