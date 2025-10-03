import { usePluginSettings } from '../api';

// Types for Draw Plugin Settings
export interface INftCombo {
    comboId: bigint;
    nftUnits: Array<{
        id: bigint;
        unit: bigint;
    }>;
    isEnabled: boolean;
    maxExchangeCount: bigint;
    maxSingleBatch: bigint;
    currentExchangeCount: bigint;
}

export interface IDrawPluginSettings {
    tokenA: string;
    tokenB: string;
    eligibleToken: string;
    minTokenAmount: bigint;
    isErc1155Eligible: boolean;
    eligibleNftId: bigint;
    drawInterval: bigint;
    nftCombos: INftCombo[];
}

// React Query hook to fetch draw plugin settings
export const useDrawPluginSettings = (daoId: string) => {
    const { data, isLoading, error } = usePluginSettings(daoId);
    
    // Transform the data to match the expected format
    const transformedData = data ? {
        tokenA: data.tokenA,
        tokenB: data.tokenB,
        eligibleToken: data.eligibleToken,
        minTokenAmount: BigInt(data.minTokenAmount),
        isErc1155Eligible: data.isErc1155Eligible,
        eligibleNftId: BigInt(data.eligibleNftId),
        drawInterval: BigInt(data.drawInterval),
        nftCombos: data.nftCombos.map(combo => ({
            comboId: BigInt(combo.comboId),
            nftUnits: combo.nftUnits.map(unit => ({
                id: BigInt(unit.id),
                unit: BigInt(unit.unit)
            })),
            isEnabled: combo.isEnabled,
            maxExchangeCount: BigInt(combo.maxExchangeCount),
            maxSingleBatch: BigInt(combo.maxSingleBatch),
            currentExchangeCount: BigInt(combo.currentExchangeCount)
        }))
    } : undefined;
    
    return {
        data: transformedData,
        isLoading,
        error
    };
};