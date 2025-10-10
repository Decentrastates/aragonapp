import type { IcoToken, TradingPair, SalesBatch } from '../../../../types/icoTypes';

export type { IIcoToken, ITradingPair, IIcoBatch, IPurchaseRecord, IIcoConfig } from './icoDomainTypes';

export interface IIcoBatch extends SalesBatch {
    /**
     * Unique identifier for the ICO batch.
     */
    id: string;
    /**
     * Name of the batch.
     */
    name: string;
    /**
     * Description of the batch.
     */
    description: string;
    /**
     * Start time of the batch.
     */
    startTime: number;
    /**
     * End time of the batch.
     */
    endTime: number;
    /**
     * Trading pair for the batch.
     */
    tradingPair: ITradingPair;
    /**
     * Total limit of tokens for the batch.
     */
    totalLimit: string;
    /**
     * User limit of tokens for the batch.
     */
    userLimit: string;
    /**
     * Amount of tokens sold.
     */
    soldAmount: string;
    /**
     * Flag indicating if the batch is active.
     */
    isActive: boolean;
}

export interface ITradingPair extends TradingPair {
    /**
     * Unique identifier for the trading pair.
     */
    id: string;
    /**
     * Input token for the trading pair.
     */
    inputToken: IIcoToken;
    /**
     * Output token for the trading pair.
     */
    outputToken: IIcoToken;
    /**
     * Exchange rate for the trading pair.
     */
    exchangeRate: number;
}

export interface IIcoToken extends IcoToken {
    /**
     * Address of the token.
     */
    address: string;
    /**
     * Name of the token.
     */
    name: string;
    /**
     * Symbol of the token.
     */
    symbol: string;
    /**
     * Decimals of the token.
     */
    decimals: number;
}

export interface IPurchaseRecord {
    /**
     * Unique identifier for the purchase record.
     */
    id: string;
    /**
     * ID of the user who made the purchase.
     */
    userId: string;
    /**
     * ID of the batch for the purchase.
     */
    batchId: string;
    /**
     * Amount of tokens purchased.
     */
    amount: string;
    /**
     * Timestamp of the purchase.
     */
    timestamp: number;
    /**
     * Transaction hash of the purchase.
     */
    transactionHash: string;
}

export interface IIcoConfig {
    /**
     * Address of the DAO.
     */
    daoAddress: string;
    /**
     * List of batches.
     */
    batches: IIcoBatch[];
    /**
     * Total amount of tokens sold.
     */
    totalSold: string;
    /**
     * Total limit of tokens for the ICO.
     */
    totalLimit: string;
}