# 前端部署插件实例化所需字段结构

本文档详细说明了在前端部署抽奖插件实例化时所需提供的字段结构。

## 1. 插件安装参数结构

插件安装需要提供以下主要参数：

### 1.1 TokenSettings 结构

```javascript
{
  tokenA: "0x...",           // ERC20代币地址，设置为address(0)以部署新代币
  tokenB: "0x...",           // ERC1155代币地址，设置为address(0)以部署新代币
  erc20Name: "Draw Token",   // ERC20代币名称（仅在部署新代币时使用）
  erc20Symbol: "DRAW",       // ERC20代币符号（仅在部署新代币时使用）
  erc1155Uri: "https://example.com/api/{id}.json"  // ERC1155代币URI（仅在部署新代币时使用）
}
```

### 1.2 资格验证参数

```javascript
{
  eligibleToken: "0x...",    // 用于资格验证的代币地址
  minTokenAmount: 100,       // 最低代币持有量要求
  isErc1155Eligible: false,  // 是否为ERC1155代币
  eligibleNftId: 1,          // ERC1155代币ID（如果isErc1155Eligible为true）
  drawInterval: 86400        // 抽奖间隔（秒）
}
```

### 1.3 NFT 组合参数

```javascript
[
  {
    comboId: 1, // 组合ID
    nftUnits: [
      // NFT单元数组
      {
        id: 1, // NFT ID
        unit: 1, // 单组兑换需该ID的数量
      },
    ],
    isEnabled: true, // 是否启用
    maxExchangeCount: 100, // 全局最大兑换次数
    maxSingleBatch: 10, // 单次最大兑换组数
    currentExchangeCount: 0, // 当前已兑换次数
  },
];
```

## 2. 完整参数结构示例

```javascript
const pluginInstallationParams = {
  // Token设置
  tokenSettings: {
    tokenA: "0x0000000000000000000000000000000000000000", // 部署新ERC20代币
    tokenB: "0x0000000000000000000000000000000000000000", // 部署新ERC1155代币
    erc20Name: "Draw Token",
    erc20Symbol: "DRAW",
    erc1155Uri: "https://example.com/api/{id}.json",
  },

  // 资格验证参数
  eligibleToken: "0x...", // ERC20代币地址
  minTokenAmount: 100,
  isErc1155Eligible: false,
  eligibleNftId: 1,
  drawInterval: 86400, // 24小时

  // NFT组合
  initNFTCombos: [
    {
      comboId: 1,
      nftUnits: [
        {
          id: 1,
          unit: 1,
        },
      ],
      isEnabled: true,
      maxExchangeCount: 100,
      maxSingleBatch: 10,
      currentExchangeCount: 0,
    },
  ],
};
```

## 3. 字段详细说明

### 3.1 TokenSettings 字段说明

| 字段名      | 类型    | 必填 | 说明                                                |
| ----------- | ------- | ---- | --------------------------------------------------- |
| tokenA      | address | 是   | ERC20 代币地址，设置为 0x0000...0000 以部署新代币   |
| tokenB      | address | 是   | ERC1155 代币地址，设置为 0x0000...0000 以部署新代币 |
| erc20Name   | string  | 否   | ERC20 代币名称（仅在部署新代币时使用）              |
| erc20Symbol | string  | 否   | ERC20 代币符号（仅在部署新代币时使用）              |
| erc1155Uri  | string  | 否   | ERC1155 代币 URI（仅在部署新代币时使用）            |

### 3.2 资格验证字段说明

| 字段名            | 类型    | 必填 | 说明                                              |
| ----------------- | ------- | ---- | ------------------------------------------------- |
| eligibleToken     | address | 是   | 用于资格验证的代币地址                            |
| minTokenAmount    | uint256 | 是   | 最低代币持有量要求                                |
| isErc1155Eligible | bool    | 是   | 是否为 ERC1155 代币                               |
| eligibleNftId     | uint256 | 是   | ERC1155 代币 ID（如果 isErc1155Eligible 为 true） |
| drawInterval      | uint256 | 是   | 抽奖间隔（秒）                                    |

### 3.3 NFT 组合字段说明

| 字段名               | 类型    | 必填 | 说明             |
| -------------------- | ------- | ---- | ---------------- |
| comboId              | uint256 | 是   | 组合 ID          |
| nftUnits             | array   | 是   | NFT 单元数组     |
| isEnabled            | bool    | 是   | 是否启用         |
| maxExchangeCount     | uint256 | 是   | 全局最大兑换次数 |
| maxSingleBatch       | uint256 | 是   | 单次最大兑换组数 |
| currentExchangeCount | uint256 | 是   | 当前已兑换次数   |

### 3.4 NFT 单元字段说明

| 字段名 | 类型    | 必填 | 说明                   |
| ------ | ------- | ---- | ---------------------- |
| id     | uint256 | 是   | NFT ID                 |
| unit   | uint256 | 是   | 单组兑换需该 ID 的数量 |

## 4. 前端实现示例

```javascript
// 构建插件安装参数
const buildPluginInstallationParams = (
  daoAddress,
  tokenSettings,
  eligibilityParams,
  nftCombos
) => {
  // 编码参数
  const encodedParams = web3.eth.abi.encodeParameters(
    [
      "tuple(address,address,string,string,string)", // TokenSettings
      "address", // eligibleToken
      "uint256", // minTokenAmount
      "bool", // isErc1155Eligible
      "uint256", // eligibleNftId
      "uint256", // drawInterval
      "tuple(uint256,tuple(uint256,uint256)[],bool,uint256,uint256,uint256)[]", // NFTCombination[]
    ],
    [
      [
        tokenSettings.tokenA,
        tokenSettings.tokenB,
        tokenSettings.erc20Name,
        tokenSettings.erc20Symbol,
        tokenSettings.erc1155Uri,
      ],
      eligibilityParams.eligibleToken,
      eligibilityParams.minTokenAmount,
      eligibilityParams.isErc1155Eligible,
      eligibilityParams.eligibleNftId,
      eligibilityParams.drawInterval,
      nftCombos.map((combo) => [
        combo.comboId,
        combo.nftUnits.map((unit) => [unit.id, unit.unit]),
        combo.isEnabled,
        combo.maxExchangeCount,
        combo.maxSingleBatch,
        combo.currentExchangeCount,
      ]),
    ]
  );

  return encodedParams;
};

// 调用插件安装
const installPlugin = async (
  pspAddress,
  pluginSetupRef,
  installationParams
) => {
  const psp = new web3.eth.Contract(PluginSetupProcessorABI, pspAddress);

  const prepareParams = {
    pluginSetupRef: pluginSetupRef,
    data: installationParams,
  };

  const result = await psp.methods
    .prepareInstallation(daoAddress, prepareParams)
    .send({
      from: deployerAddress,
    });

  return result;
};
```

## 5. 注意事项

1. **条件部署**：当 tokenA 或 tokenB 设置为 address(0)时，系统会自动部署新的代币合约。
2. **地址验证**：所有地址字段必须是有效的以太坊地址。
3. **数值范围**：确保数值字段在合理范围内，避免溢出。
4. **权限管理**：部署后需要正确设置 DAO 权限以管理插件。
