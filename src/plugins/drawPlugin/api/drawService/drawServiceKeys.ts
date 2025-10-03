// Query keys for draw service
export const DrawServiceKey = {
    ROOT: 'draw',
} as const;

export const drawServiceKeys = {
    all: () => [DrawServiceKey.ROOT] as const,
    eligibility: (daoId: string) => [DrawServiceKey.ROOT, 'eligibility', daoId] as const,
    history: (daoId: string, page: number, limit: number) => [DrawServiceKey.ROOT, 'history', daoId, page, limit] as const,
    nftHoldings: (daoId: string) => [DrawServiceKey.ROOT, 'nftHoldings', daoId] as const,
    redemptionRequirements: (daoId: string) => [DrawServiceKey.ROOT, 'redemptionRequirements', daoId] as const,
    validNftIds: (daoId: string) => [DrawServiceKey.ROOT, 'validNftIds', daoId] as const,
    nftSupply: (daoId: string, nftId: string) => [DrawServiceKey.ROOT, 'nftSupply', daoId, nftId] as const,
    pluginSettings: (daoId: string) => [DrawServiceKey.ROOT, 'pluginSettings', daoId] as const,
};