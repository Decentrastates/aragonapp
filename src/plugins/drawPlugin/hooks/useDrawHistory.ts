import { useDrawHistory as useDrawHistoryService } from '../api';

export const useDrawHistory = (daoId: string, page = 1) => {
    const { data, isLoading, error } = useDrawHistoryService(daoId, page);
    
    return {
        history: data,
        isLoading,
        error,
    };
};