import { AragonBackendService, type IPaginatedResponse } from '@/shared/api/aragonBackendService';
import type { IIcoBatch, IPurchaseRecord, IIcoConfig } from './domain';
import type { IGetIcoBatchesParams, IGetUserPurchasesParams, IGetIcoConfigParams } from './icoService.api';

class IcoService extends AragonBackendService {
    private urls = {
        icoBatches: '/v1/ico/:daoAddress/batches',
        userPurchases: '/v1/ico/users/:userAddress/purchases',
        icoConfig: '/v1/ico/:daoAddress/config',
    };

    getIcoBatches = async (params: IGetIcoBatchesParams): Promise<IPaginatedResponse<IIcoBatch>> => {
        const result = await this.request<IPaginatedResponse<IIcoBatch>>(this.urls.icoBatches, params);

        return result;
    };

    getUserPurchases = async (params: IGetUserPurchasesParams): Promise<IPaginatedResponse<IPurchaseRecord>> => {
        const result = await this.request<IPaginatedResponse<IPurchaseRecord>>(this.urls.userPurchases, params);

        return result;
    };

    getIcoConfig = async (params: IGetIcoConfigParams): Promise<IIcoConfig> => {
        const result = await this.request<IIcoConfig>(this.urls.icoConfig, params);

        return result;
    };
}

export const icoService = new IcoService();