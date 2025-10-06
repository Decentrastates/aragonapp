// 抽奖插件设置参数的ABI定义，支持条件部署
export const drawPluginSetupAbi = [
    // 代币设置
    { name: 'tokenA', type: 'address' }, // ERC20代币地址，设置为address(0)表示部署新代币
    { name: 'tokenB', type: 'address' }, // ERC1155代币地址，设置为address(0)表示部署新代币
    { name: 'erc20Name', type: 'string' }, // ERC20代币名称（仅在部署新代币时使用）
    { name: 'erc20Symbol', type: 'string' }, // ERC20代币符号（仅在部署新代币时使用）
    { name: 'erc1155Uri', type: 'string' }, // ERC1155代币URI（仅在部署新代币时使用）

    // 参与资格参数
    { name: 'eligibleToken', type: 'address' }, // 用于资格验证的代币地址
    { name: 'minTokenAmount', type: 'uint256' }, // 最低代币持有要求
    { name: 'isErc1155Eligible', type: 'bool' }, // 是否使用ERC1155代币进行资格验证
    { name: 'eligibleNftId', type: 'uint256' }, // ERC1155代币ID（如果isErc1155Eligible为true则必需）
    { name: 'drawInterval', type: 'uint256' }, // 抽奖间隔（以秒为单位）

    // NFT组合
    {
        name: 'initNFTCombos',
        type: 'tuple[]',
        components: [
            { name: 'comboId', type: 'uint256' }, // 组合ID
            {
                name: 'nftUnits',
                type: 'tuple[]',
                components: [
                    { name: 'id', type: 'uint256' }, // NFT ID
                    { name: 'unit', type: 'uint256' }, // 每次兑换所需此NFT ID的数量
                ],
            },
            { name: 'isEnabled', type: 'bool' }, // 此组合是否启用
            { name: 'maxExchangeCount', type: 'uint256' }, // 此组合的最大总兑换次数
            { name: 'maxSingleBatch', type: 'uint256' }, // 单次批量兑换的最大组合数
            { name: 'currentExchangeCount', type: 'uint256' }, // 此组合的当前兑换次数
        ],
    },
] as const;

// 抽奖插件准备更新参数的ABI定义
export const drawPluginPrepareUpdateAbi = [
    {
        name: 'targetConfig',
        type: 'tuple',
        components: [
            { name: 'target', type: 'address' }, // 目标地址
            { name: 'operation', type: 'uint8' }, // 操作类型
        ],
    },
    { name: 'metadata', type: 'bytes' }, // 元数据
] as const;

// 抽奖插件主要功能的ABI定义
export const drawPluginAbi = [
    {
        name: 'drawNFT',
        type: 'function',
        inputs: [{ name: 'signature', type: 'bytes' }], // 签名
        outputs: [
            { name: 'success', type: 'bool' }, // 是否成功
            { name: 'nftId', type: 'uint256' }, // 抽中的NFT ID
            { name: 'amount', type: 'uint256' }, // 数量
            { name: 'message', type: 'string' }, // 消息
        ],
        stateMutability: 'nonpayable',
    },
    {
        name: 'exchangeToken',
        type: 'function',
        inputs: [
            { name: 'comboId', type: 'uint256' }, // 组合ID
            { name: 'batchCount', type: 'uint256' }, // 批量数量
            { name: 'signature', type: 'bytes' }, // 签名
        ],
        outputs: [
            { name: 'success', type: 'bool' }, // 是否成功
            { name: 'amount', type: 'uint256' }, // 数量
            { name: 'message', type: 'string' }, // 消息
        ],
        stateMutability: 'nonpayable',
    },
    {
        name: 'getValidNftIds',
        type: 'function',
        inputs: [],
        outputs: [{ name: 'ids', type: 'uint256[]' }], // 有效的NFT ID列表
        stateMutability: 'view',
    },
    {
        name: 'getNftSupply',
        type: 'function',
        inputs: [{ name: 'nftId', type: 'uint256' }], // NFT ID
        outputs: [
            { name: 'current', type: 'uint256' }, // 当前供应量
            { name: 'max', type: 'uint256' }, // 最大供应量
        ],
        stateMutability: 'view',
    },
    {
        name: 'updateEligibilityParam',
        type: 'function',
        inputs: [
            { name: 'paramName', type: 'string' }, // 参数名称
            { name: 'newValue', type: 'uint256' }, // 新值
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        name: 'updateBlacklist',
        type: 'function',
        inputs: [
            { name: 'users', type: 'address[]' }, // 用户地址列表
            { name: 'isBlacklisted', type: 'bool' }, // 是否加入黑名单
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        name: 'updateNFTCombo',
        type: 'function',
        inputs: [
            { name: 'comboId', type: 'uint256' }, // 组合ID
            { name: 'isEnabled', type: 'bool' }, // 是否启用
            { name: 'maxSingleBatch', type: 'uint256' }, // 单次批量最大值
            { name: 'maxExchangeCount', type: 'uint256' }, // 最大兑换次数
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        name: 'setNFTMaxSupply',
        type: 'function',
        inputs: [
            { name: 'nftId', type: 'uint256' }, // NFT ID
            { name: 'maxSupply', type: 'uint256' }, // 最大供应量
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        name: 'createProposal',
        type: 'function',
        inputs: [
            { name: '_metadata', type: 'bytes' }, // 元数据
            {
                name: '_actions',
                type: 'tuple[]',
                components: [
                    { name: 'to', type: 'address' }, // 目标地址
                    { name: 'value', type: 'uint256' }, // 转账金额
                    { name: 'data', type: 'bytes' }, // 调用数据
                ],
            },
            { name: '_allowFailureMap', type: 'uint256' }, // 允许失败的映射
            { name: '_startDate', type: 'uint64' }, // 开始日期
            { name: '_endDate', type: 'uint64' }, // 结束日期
        ],
        outputs: [{ name: 'proposalId', type: 'uint256' }], // 提案ID
        stateMutability: 'nonpayable',
    },
] as const;