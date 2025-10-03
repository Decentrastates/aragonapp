// 模拟的NFT持有数据
export const mockNftHoldings = [
    {
        id: '1',
        name: 'Rare NFT #1',
        quantity: 2,
        metadataUri: 'https://example.com/nft/1'
    },
    {
        id: '2',
        name: 'Rare NFT #2',
        quantity: 1,
        metadataUri: 'https://example.com/nft/2'
    }
];

// 模拟的兑换要求数据
export const mockRedemptionRequirements = [
    {
        nftId: '1',
        requiredQuantity: 1,
        isMet: true
    },
    {
        nftId: '2',
        requiredQuantity: 2,
        isMet: false
    }
];