import type { QueryOptions, SharedQueryOptions } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import type { IIcoConfig } from '../../domain';
import { icoService } from '../../icoService';
import type { IGetIcoConfigParams } from '../../icoService.api';
import { icoServiceKeys } from '../../icoServiceKeys';

export const icoConfigOptions = (
    params: IGetIcoConfigParams,
    options?: QueryOptions<IIcoConfig, IGetIcoConfigParams>,
): SharedQueryOptions<IIcoConfig, IGetIcoConfigParams> => ({
    queryKey: icoServiceKeys.icoConfig(params),
    queryFn: () => icoService.getIcoConfig(params),
    ...options,
});

export const useIcoConfig = (
    params: IGetIcoConfigParams,
    options?: QueryOptions<IIcoConfig, IGetIcoConfigParams>,
) => {
    return useQuery(icoConfigOptions(params, options));
};