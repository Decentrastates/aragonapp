import { type IPaginatedResponse } from '@/shared/api/aragonBackendService';
import type { InfiniteQueryOptions, SharedInfiniteQueryOptions } from '@/shared/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { IIcoBatch } from '../../domain';
import { icoService } from '../../icoService';
import type { IGetIcoBatchesParams } from '../../icoService.api';
import { icoServiceKeys } from '../../icoServiceKeys';

export const icoBatchesOptions = (
    params: IGetIcoBatchesParams,
    options?: InfiniteQueryOptions<IPaginatedResponse<IIcoBatch>, IGetIcoBatchesParams>,
): SharedInfiniteQueryOptions<IPaginatedResponse<IIcoBatch>, IGetIcoBatchesParams> => ({
    queryKey: icoServiceKeys.icoBatches(params),
    initialPageParam: params,
    queryFn: ({ pageParam }) => icoService.getIcoBatches(pageParam),
    getNextPageParam: icoService.getNextPageParams,
    ...options,
});

export const useIcoBatches = (
    params: IGetIcoBatchesParams,
    options?: InfiniteQueryOptions<IPaginatedResponse<IIcoBatch>, IGetIcoBatchesParams>,
) => {
    return useInfiniteQuery(icoBatchesOptions(params, options));
};