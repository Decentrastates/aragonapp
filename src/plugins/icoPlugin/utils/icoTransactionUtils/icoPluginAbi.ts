// ICO 合约设置参数的ABI定义
export const icoPluginSetupAbi = [
  { name: 'governanceToken', type: 'address' }, // 治理代币地址
  { name: 'fundingRecipient', type: 'address' }, // 资金接收地址
  { name: 'pluginMetadata', type: 'bytes' }, // 插件元数据
] as const;

// ICO 合约主要功能的ABI定义
export const icoPluginAbi = [
  {
    name: 'buyTokens',
    type: 'function',
    inputs: [
      { name: 'batchId', type: 'uint256' }, // 批次ID
      { name: 'amount', type: 'uint256' } // 购买数量
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    name: 'createBatch',
    type: 'function',
    inputs: [
      { name: 'batchId', type: 'uint256' }, // 批次ID
      { name: 'inputToken', type: 'address' }, // 输入代币地址
      { name: 'exchangeRate', type: 'uint256' }, // 兑换率
      { name: 'totalLimit', type: 'uint256' }, // 总限额
      { name: 'userLimit', type: 'uint256' }, // 用户限额
      { name: 'startTime', type: 'uint256' }, // 开始时间
      { name: 'endTime', type: 'uint256' } // 结束时间
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'getBatch',
    type: 'function',
    inputs: [
      { name: 'batchId', type: 'uint256' } // 批次ID
    ],
    outputs: [
      {
        name: 'batch',
        type: 'tuple',
        components: [
          { name: 'inputToken', type: 'address' }, // 输入代币地址
          { name: 'exchangeRate', type: 'uint256' }, // 兑换率
          { name: 'totalLimit', type: 'uint256' }, // 总限额
          { name: 'userLimit', type: 'uint256' }, // 用户限额
          { name: 'soldAmount', type: 'uint256' }, // 已售数量
          { name: 'startTime', type: 'uint256' }, // 开始时间
          { name: 'endTime', type: 'uint256' }, // 结束时间
          { name: 'isActive', type: 'bool' } // 是否激活
        ]
      }
    ],
    stateMutability: 'view',
  },
  {
    name: 'getUserPurchaseAmount',
    type: 'function',
    inputs: [
      { name: 'user', type: 'address' }, // 用户地址
      { name: 'batchId', type: 'uint256' } // 批次ID
    ],
    outputs: [
      { name: 'amount', type: 'uint256' } // 购买数量
    ],
    stateMutability: 'view',
  },
  {
    name: 'toggleBatchStatus',
    type: 'function',
    inputs: [
      { name: 'batchId', type: 'uint256' } // 批次ID
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'totalSold',
    type: 'function',
    inputs: [],
    outputs: [
      { name: 'amount', type: 'uint256' } // 总售数量
    ],
    stateMutability: 'view',
  },
  {
    name: 'updateBatchLimit',
    type: 'function',
    inputs: [
      { name: 'batchId', type: 'uint256' }, // 批次ID
      { name: 'newLimit', type: 'uint256' } // 新限额
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'updateExchangeRate',
    type: 'function',
    inputs: [
      { name: 'batchId', type: 'uint256' }, // 批次ID
      { name: 'newRate', type: 'uint256' } // 新兑换率
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  }
] as const;

// ICO 合约事件的ABI定义
export const icoPluginEventsAbi = [
  {
    name: 'TokensPurchased',
    type: 'event',
    inputs: [
      { name: 'buyer', type: 'address', indexed: true }, // 购买者
      { name: 'amount', type: 'uint256' }, // 购买数量
      { name: 'cost', type: 'uint256' } // 成本
    ]
  }
] as const;
