import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useDao } from '@/shared/api/daoService';
import { drawApiService } from '@/plugins/drawPlugin/api/drawApiService';
import type { ICheckEligibilityRequest } from '@/plugins/drawPlugin/api/drawService.api';
import { drawServiceKeys } from '@/plugins/drawPlugin/api/drawService/drawServiceKeys';

export const drawEligibilityOptions = (
    params: ICheckEligibilityRequest,
) => ({
    queryKey: drawServiceKeys.eligibility(params.daoAddress),
    queryFn: () => drawApiService.checkEligibility(params),
});

export const useDrawEligibility = (daoId: string) => {
    const { address: userAddress } = useAccount();
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useQuery({
        queryKey: drawServiceKeys.eligibility(daoId),
        queryFn: () => drawApiService.checkEligibility({
            daoAddress: dao!.address,
            userAddress: userAddress!
        }),
        enabled: !!(dao?.address && userAddress),
    });
};