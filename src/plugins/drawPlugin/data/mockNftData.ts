// 模拟的ERC1155 NFT数据
export interface MockNftItem {
    id: string;
    name: string;
    description: string;
    image: string;
    tokenId: string;
    contractAddress: string;
    attributes: Array<{
        trait_type: string;
        value: string;
    }>;
}

// ERC1155合约地址
export const ERC1155_CONTRACT_ADDRESS = '0xXXXX'; // 这里应该是实际的合约地址

// 12个模拟的NFT项目
export const mockNftList: MockNftItem[] = [
    {
        id: '1',
        name: '稀有龙 #1',
        description: '一条稀有的火龙，拥有强大的力量',
        image: 'https://example.com/nft/dragon1.png',
        tokenId: '1',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '传说' },
            { trait_type: '元素', value: '火' },
            { trait_type: '等级', value: '10' }
        ]
    },
    {
        id: '2',
        name: '稀有龙 #2',
        description: '一条稀有的水龙，掌控水域之力',
        image: 'https://example.com/nft/dragon2.png',
        tokenId: '2',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '史诗' },
            { trait_type: '元素', value: '水' },
            { trait_type: '等级', value: '8' }
        ]
    },
    {
        id: '3',
        name: '稀有龙 #3',
        description: '一条稀有的风龙，翱翔于天际',
        image: 'https://example.com/nft/dragon3.png',
        tokenId: '3',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '史诗' },
            { trait_type: '元素', value: '风' },
            { trait_type: '等级', value: '9' }
        ]
    },
    {
        id: '4',
        name: '稀有龙 #4',
        description: '一条稀有的土龙，坚不可摧',
        image: 'https://example.com/nft/dragon4.png',
        tokenId: '4',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '稀有' },
            { trait_type: '元素', value: '土' },
            { trait_type: '等级', value: '7' }
        ]
    },
    {
        id: '5',
        name: '魔法剑 #1',
        description: '一把闪耀着魔法光芒的剑',
        image: 'https://example.com/nft/sword1.png',
        tokenId: '5',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '传说' },
            { trait_type: '攻击力', value: '100' },
            { trait_type: '附魔', value: '火焰' }
        ]
    },
    {
        id: '6',
        name: '魔法剑 #2',
        description: '一把蕴含冰霜之力的剑',
        image: 'https://example.com/nft/sword2.png',
        tokenId: '6',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '史诗' },
            { trait_type: '攻击力', value: '80' },
            { trait_type: '附魔', value: '冰霜' }
        ]
    },
    {
        id: '7',
        name: '魔法盾 #1',
        description: '一面坚不可摧的魔法盾',
        image: 'https://example.com/nft/shield1.png',
        tokenId: '7',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '史诗' },
            { trait_type: '防御力', value: '90' },
            { trait_type: '附魔', value: '神圣' }
        ]
    },
    {
        id: '8',
        name: '魔法盾 #2',
        description: '一面能够反弹攻击的魔法盾',
        image: 'https://example.com/nft/shield2.png',
        tokenId: '8',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '稀有' },
            { trait_type: '防御力', value: '70' },
            { trait_type: '附魔', value: '反弹' }
        ]
    },
    {
        id: '9',
        name: '魔法药水 #1',
        description: '一瓶能够恢复全部生命的药水',
        image: 'https://example.com/nft/potion1.png',
        tokenId: '9',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '普通' },
            { trait_type: '效果', value: '生命恢复' },
            { trait_type: '数量', value: '10' }
        ]
    },
    {
        id: '10',
        name: '魔法药水 #2',
        description: '一瓶能够恢复全部魔法的药水',
        image: 'https://example.com/nft/potion2.png',
        tokenId: '10',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '普通' },
            { trait_type: '效果', value: '魔法恢复' },
            { trait_type: '数量', value: '10' }
        ]
    },
    {
        id: '11',
        name: '稀有戒指 #1',
        description: '一枚蕴含强大魔力的戒指',
        image: 'https://example.com/nft/ring1.png',
        tokenId: '11',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '传说' },
            { trait_type: '效果', value: '全属性+10' },
            { trait_type: '等级', value: '15' }
        ]
    },
    {
        id: '12',
        name: '稀有戒指 #2',
        description: '一枚能够增加暴击率的戒指',
        image: 'https://example.com/nft/ring2.png',
        tokenId: '12',
        contractAddress: ERC1155_CONTRACT_ADDRESS,
        attributes: [
            { trait_type: '稀有度', value: '史诗' },
            { trait_type: '效果', value: '暴击率+20%' },
            { trait_type: '等级', value: '12' }
        ]
    }
];