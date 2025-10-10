import type { IGetIcoBatchesParams, IGetUserPurchasesParams, IGetIcoConfigParams } from './icoService.api';

export enum IcoServiceKey {
    ICO_BATCHES = 'ICO_BATCHES',
    USER_PURCHASES = 'USER_PURCHASES',
    ICO_CONFIG = 'ICO_CONFIG',
}

export const icoServiceKeys = {
    icoBatches: (params: IGetIcoBatchesParams) => [IcoServiceKey.ICO_BATCHES, params],
    userPurchases: (params: IGetUserPurchasesParams) => [IcoServiceKey.USER_PURCHASES, params],
    icoConfig: (params: IGetIcoConfigParams) => [IcoServiceKey.ICO_CONFIG, params],
};