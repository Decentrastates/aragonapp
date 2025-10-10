import { type IPaginatedResponse } from '@/shared/api/aragonBackendService';
import type { InfiniteQueryOptions, SharedInfiniteQueryOptions } from '@/shared/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { IPurchaseRecord } from '../../domain';
import { icoService } from '../../icoService';
import type { IGetUserPurchasesParams } from '../../icoService.api';
import { icoServiceKeys } from '../../icoServiceKeys';

export const userPurchasesOptions = (
    params: IGetUserPurchasesParams,
    options?: InfiniteQueryOptions<IPaginatedResponse<IPurchaseRecord>, IGetUserPurchasesParams>,
): SharedInfiniteQueryOptions<IPaginatedResponse<IPurchaseRecord>, IGetUserPurchasesParams> => ({
    queryKey: icoServiceKeys.userPurchases(params),
    initialPageParam: params,
    queryFn: ({ pageParam }) => icoService.getUserPurchases(pageParam),
    getNextPageParam: icoService.getNextPageParams,
    ...options,
});

export const useUserPurchases = (
    params: IGetUserPurchasesParams,
    options?: InfiniteQueryOptions<IPaginatedResponse<IPurchaseRecord>, IGetUserPurchasesParams>,
) => {
    return useInfiniteQuery(userPurchasesOptions(params, options));
};