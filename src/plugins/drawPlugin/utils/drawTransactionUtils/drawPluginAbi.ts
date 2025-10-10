// 抽奖插件设置参数的ABI定义，支持条件部署（优化版本，参考tokenVoting模式）
export const drawPluginSetupAbi = [
    {
        name: 'erc20Settings',
        type: 'tuple',
        components: [
            { name: 'tokenAddress', type: 'address' },
        ],
    },
    {
        name: 'erc1155Settings',
        type: 'tuple',
        components: [
            { name: 'tokenAddress', type: 'address' },
            { name: 'uri', type: 'string' },
        ],
    },
    {
        name: 'drawSettings',
        type: 'tuple',
        components: [
            { name: 'minTokenAmount', type: 'uint256' },
            { name: 'isErc1155Eligible', type: 'bool' },
            { name: 'eligibleERC1155Id', type: 'uint256' },
            { name: 'drawInterval', type: 'uint256' },
        ],
    },
    {
        name: 'initNFTCombo',
        type: 'tuple',
        components: [
            {
                name: 'nftUnits',
                type: 'tuple[]',
                components: [
                    { name: 'id', type: 'uint256' }, // NFT ID
                    { name: 'unit', type: 'uint256' }, // 每次兑换所需此NFT ID的数量
                ],
            },
            { name: 'maxExchangeCount', type: 'uint256' }, // 此组合的最大总兑换次数
            { name: 'maxSingleBatch', type: 'uint256' }, // 单次批量兑换的最大组合数
            { name: 'currentExchangeCount', type: 'uint256' }, // 此组合的当前兑换次数
        ],
    },
    {
        name: 'targetConfig',
        type: 'tuple',
        components: [
            { name: 'target', type: 'address' },
            { name: 'operation', type: 'uint8' },
        ],
    },
    {
        name: 'pluginMetadata',
        type: 'bytes',
    },
] as const;

// 抽奖插件准备更新参数的ABI定义
export const drawPluginPrepareUpdateAbi = [
  {
    name: "targetConfig",
    type: "tuple",
    components: [
      { name: "target", type: "address" },
      { name: "operation", type: "uint8" },
    ],
  },
  { name: "metadata", type: "bytes" },
] as const;

// 抽奖插件主要功能的ABI定义
export const drawPluginAbi = [
  {
    name: "drawNFT",
    type: "function",
    inputs: [{ name: "signature", type: "bytes" }], // 签名
    outputs: [
      { name: "success", type: "bool" }, // 是否成功
      { name: "nftId", type: "uint256" }, // 抽中的NFT ID
      { name: "mintAmount", type: "uint256" }, // 数量
      { name: "detail", type: "string" }, // 消息
    ],
    stateMutability: "nonpayable",
  },
  {
    name: "exchangeToken",
    type: "function",
    inputs: [
      { name: "batchCount", type: "uint256" }, // 批量数量
      { name: "signature", type: "bytes" }, // 签名
    ],
    outputs: [
      { name: "success", type: "bool" }, // 是否成功
      { name: "tokenAAmount", type: "uint256" }, // 数量
      { name: "detail", type: "string" }, // 消息
    ],
    stateMutability: "nonpayable",
  },
  {
    name: "getValidNftIds",
    type: "function",
    inputs: [],
    outputs: [{ name: "ids", type: "uint256[]" }], // 有效的NFT ID列表
    stateMutability: "view",
  },
  {
    name: "getNftSupply",
    type: "function",
    inputs: [{ name: "nftId", type: "uint256" }], // NFT ID
    outputs: [
      { name: "current", type: "uint256" }, // 当前供应量
      { name: "max", type: "uint256" }, // 最大供应量
    ],
    stateMutability: "view",
  },
  {
    name: "checkUserEligibility",
    type: "function",
    inputs: [{ name: "user", type: "address" }], // 用户地址
    outputs: [
      { name: "isEligible", type: "bool" }, // 是否有资格
      { name: "reason", type: "string" }, // 原因
    ],
    stateMutability: "view",
  },
  {
    name: "updateEligibilityParam",
    type: "function",
    inputs: [
      { name: "paramName", type: "string" }, // 参数名称
      { name: "newValue", type: "uint256" }, // 新值
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "updateBlacklist",
    type: "function",
    inputs: [
      { name: "users", type: "address[]" }, // 用户地址列表
      { name: "isBlacklisted", type: "bool" }, // 是否加入黑名单
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "updateNFTCombo",
    type: "function",
    inputs: [
      { name: "maxSingleBatch", type: "uint256" }, // 单次批量最大值
      { name: "maxExchangeCount", type: "uint256" }, // 最大兑换次数
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "setNFTMaxSupply",
    type: "function",
    inputs: [
      { name: "nftId", type: "uint256" }, // NFT ID
      { name: "maxSupply", type: "uint256" }, // 最大供应量
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "getCurrentNFTCombo",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "combination",
        type: "tuple",
        components: [
          {
            name: "nftUnits",
            type: "tuple[]",
            components: [
              { name: "id", type: "uint256" }, // NFT ID
              { name: "unit", type: "uint256" }, // 每次兑换所需此NFT ID的数量
            ],
          },
          { name: "maxExchangeCount", type: "uint256" }, // 此组合的最大总兑换次数
          { name: "maxSingleBatch", type: "uint256" }, // 单次批量兑换的最大组合数
          { name: "currentExchangeCount", type: "uint256" }, // 此组合的当前兑换次数
        ],
      },
    ],
    stateMutability: "view",
  },
] as const;