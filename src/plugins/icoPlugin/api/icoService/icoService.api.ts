import type { IPaginatedRequest } from '@/shared/api/aragonBackendService';
import type { Network } from '@/shared/api/daoService';
import type { IRequestUrlQueryParams } from '@/shared/api/httpService';
import type { IIcoBatch, IPurchaseRecord, IIcoConfig } from './domain';

export interface IGetIcoBatchesUrlParams {
    /**
     * Address of the DAO.
     */
    daoAddress: string;
}

export interface IGetIcoBatchesQueryParams extends IPaginatedRequest {
    /**
     * Network of the ICO.
     */
    network: Network;
    /**
     * Flag to determine whether or not to fetch only active batches.
     */
    onlyActive?: boolean;
}

export interface IGetIcoBatchesParams
    extends IRequestUrlQueryParams<IGetIcoBatchesUrlParams, IGetIcoBatchesQueryParams> {}

export interface IGetUserPurchasesUrlParams {
    /**
     * Address of the user.
     */
    userAddress: string;
}

export interface IGetUserPurchasesQueryParams extends IPaginatedRequest {
    /**
     * Network of the ICO.
     */
    network: Network;
    /**
     * Address of the DAO.
     */
    daoAddress: string;
}

export interface IGetUserPurchasesParams
    extends IRequestUrlQueryParams<IGetUserPurchasesUrlParams, IGetUserPurchasesQueryParams> {}

export interface IGetIcoConfigUrlParams {
    /**
     * Address of the DAO.
     */
    daoAddress: string;
}

export interface IGetIcoConfigQueryParams {
    /**
     * Network of the ICO.
     */
    network: Network;
}

export interface IGetIcoConfigParams
    extends IRequestUrlQueryParams<IGetIcoConfigUrlParams, IGetIcoConfigQueryParams> {}