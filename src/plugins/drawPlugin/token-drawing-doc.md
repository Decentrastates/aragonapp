# Draw Plugin 综合文档

## 1. 概述

Draw Plugin 是一个基于 Aragon OSx 的插件，实现了 NFT 抽奖和代币兑换功能。该插件支持条件部署 ERC20 和 ERC1155 代币，使 DAO 能够全面管理这些代币。

## 2. 功能特性

- NFT 抽奖功能（限定兑换组合 ID）
- 批量代币兑换
- 嵌入式资格验证
- DAO 治理控制
- 条件代币部署（可使用现有代币或部署新代币）
- 部署时自动生成带时间戳的唯一 artifact 文件

## 3. 核心组件

- [DrawContractImpl.sol](./src/DrawContractImpl.sol) - 核心实现，内置 UUPS 升级支持
- [DrawPluginSetup.sol](./src/setup/DrawPluginSetup.sol) - 插件设置，支持条件部署

## 4. 部署方式

### 4.1 使用现有代币部署

DAO 可以选择使用已有的 ERC20 和 ERC1155 代币合约。

### 4.2 条件部署新代币

插件支持条件部署 ERC20 和 ERC1155 代币。如果传入的代币地址为 0，则会自动部署新的代币合约。

#### 4.2.1 ERC20 代币部署

插件现在支持部署两种 ERC20 代币：

1. **ERC20PresetFixedSupply** - 固定供应量版本（原有实现）
2. **ERC20PresetUnlimited** - 无限供应量版本（新增实现）

##### ERC20PresetUnlimited 特性

新实现的 [ERC20PresetUnlimited](file:///Users/aos/projects/cddao/plugins/draw-plugin/src/token/ERC20PresetUnlimited.sol#L27-L147) 合约具有以下特性：

- 无限供应量，DAO 可以随时铸造新代币
- 支持销毁功能
- 支持暂停和恢复所有代币转账
- 角色权限控制：
  - **MINTER_ROLE**：允许铸造新代币
  - **PAUSER_ROLE**：允许暂停和恢复代币转账
  - **TRANSFER_MANAGER_ROLE**：允许在暂停时进行转账操作
  - **DEFAULT_ADMIN_ROLE**：默认管理员角色，可以管理其他角色

#### 4.2.2 ERC1155 代币部署

ERC1155 代币使用自定义的 [ERC1155PresetMinterPauserWithURIControl](file:///Users/aos/projects/cddao/plugins/draw-plugin/src/token/ERC1155PresetMinterPauserWithURIControl.sol#L26-L150) 合约：

- 支持铸造和销毁功能
- 支持暂停和恢复所有代币转账
- 支持更新代币 URI
- 角色权限控制：
  - **MINTER_ROLE**：允许铸造新代币
  - **PAUSER_ROLE**：允许暂停和恢复代币转账
  - **URI_MANAGER_ROLE**：允许更新代币 URI
  - **DEFAULT_ADMIN_ROLE**：默认管理员角色，可以管理其他角色

### 4.3 条件部署逻辑

在 [prepareInstallation](file:///Users/aos/projects/cddao/plugins/draw-plugin/src/setup/DrawPluginSetup.sol#L76-L202) 方法中实现了条件部署逻辑：

``solidity
// 条件部署 ERC20
if (params.tokenA == address(0)) {
params.tokenA = address(new ERC20PresetUnlimited(
params.erc20Name,
params.erc20Symbol
));
isNewTokenA = true;
}

// 条件部署 ERC1155
if (params.tokenB == address(0)) {
params.tokenB = address(new ERC1155PresetMinterPauserWithURIControl(
params.erc1155Uri
));

    // 授权DAO管理ERC1155的所有权限
    ERC1155PresetMinterPauserWithURIControl(params.tokenB).grantRole(
        ERC1155PresetMinterPauserWithURIControl(params.tokenB).MINTER_ROLE(),
        _dao
    );

    ERC1155PresetMinterPauserWithURIControl(params.tokenB).grantRole(
        ERC1155PresetMinterPauserWithURIControl(params.tokenB).PAUSER_ROLE(),
        _dao
    );

    ERC1155PresetMinterPauserWithURIControl(params.tokenB).grantRole(
        ERC1155PresetMinterPauserWithURIControl(params.tokenB).URI_MANAGER_ROLE(),
        _dao
    );

    isNewTokenB = true;

}

```

### 4.4 权限自动配置

新部署的代币合约会自动配置必要的权限：

``solidity
// 如果部署了新的ERC20，需要为DAO授权相关权限
uint256 permissionIndex = 3;
if (isNewTokenA) {
    // 授权DAO MINTER_ROLE权限
    permissions[permissionIndex] = PermissionLib.MultiTargetPermission({
        operation: PermissionLib.Operation.Grant,
        where: params.tokenA,
        who: _dao,
        condition: PermissionLib.NO_CONDITION,
        permissionId: keccak256("MINTER_ROLE")
    });
    permissionIndex++;

    // 授权DAO PAUSER_ROLE权限
    permissions[permissionIndex] = PermissionLib.MultiTargetPermission({
        operation: PermissionLib.Operation.Grant,
        where: params.tokenA,
        who: _dao,
        condition: PermissionLib.NO_CONDITION,
        permissionId: keccak256("PAUSER_ROLE")
    });
    permissionIndex++;

    // 授权DAO TRANSFER_MANAGER_ROLE权限
    permissions[permissionIndex] = PermissionLib.MultiTargetPermission({
        operation: PermissionLib.Operation.Grant,
        where: params.tokenA,
        who: _dao,
        condition: PermissionLib.NO_CONDITION,
        permissionId: keccak256("TRANSFER_MANAGER_ROLE")
    });
    permissionIndex++;
}

// 如果部署了新的ERC1155，需要为DAO授权PAUSER_ROLE和URI_MANAGER_ROLE权限
if (isNewTokenB) {
    // PAUSER_ROLE权限
    permissions[permissionIndex] = PermissionLib.MultiTargetPermission({
        operation: PermissionLib.Operation.Grant,
        where: params.tokenB,
        who: _dao,
        condition: PermissionLib.NO_CONDITION,
        permissionId: keccak256("PAUSER_ROLE")
    });
    permissionIndex++;

    // URI_MANAGER_ROLE权限
    permissions[permissionIndex] = PermissionLib.MultiTargetPermission({
        operation: PermissionLib.Operation.Grant,
        where: params.tokenB,
        who: _dao,
        condition: PermissionLib.NO_CONDITION,
        permissionId: keccak256("URI_MANAGER_ROLE")
    });
}
```

## 5. DAO 管理功能

### 5.1 插件层面管理

DAO 可以通过以下角色管理插件：

- `DRAW_MANAGER_ROLE`：管理 NFT 组合、资格参数
- `BLACKLIST_MANAGER_ROLE`：维护黑名单
- `UPGRADER_ROLE`：触发合约升级

### 5.2 ERC20 代币管理

对于新部署的 [ERC20PresetUnlimited](file:///Users/aos/projects/cddao/plugins/draw-plugin/src/token/ERC20PresetUnlimited.sol#L27-L147) 合约，DAO 具有完整的管理权限：

1. **铸造代币**：具有 MINTER_ROLE 的账户可以铸造新代币
2. **销毁代币**：任何持有代币的账户都可以销毁自己的代币
3. **暂停转账**：具有 PAUSER_ROLE 的账户可以暂停所有代币转账
4. **恢复转账**：具有 PAUSER_ROLE 的账户可以恢复代币转账
5. **特殊转账权限**：具有 TRANSFER_MANAGER_ROLE 的账户可以在暂停时进行转账

### 5.3 ERC1155 代币管理

对于新部署的 [ERC1155PresetMinterPauserWithURIControl](file:///Users/aos/projects/cddao/plugins/draw-plugin/src/token/ERC1155PresetMinterPauserWithURIControl.sol#L26-L150) 合约，DAO 具有以下管理权限：

1. **铸造 NFT**：具有 MINTER_ROLE 的账户可以铸造新的 NFT
2. **销毁 NFT**：任何持有 NFT 的账户都可以销毁自己的 NFT
3. **暂停转账**：具有 PAUSER_ROLE 的账户可以暂停所有代币转账
4. **恢复转账**：具有 PAUSER_ROLE 的账户可以恢复代币转账
5. **更新 URI**：具有 URI_MANAGER_ROLE 的账户可以更新代币的 URI

#### 5.3.1 URI 管理功能

新的 ERC1155 合约提供了两种 URI 管理方法：

1. **setTokenURI(uint256 tokenId, string memory tokenURI)**：为特定 tokenId 设置 URI
2. **setBaseURI(string memory baseURI)**：设置所有代币的基础 URI

这些方法只能由具有 URI_MANAGER_ROLE 的账户调用，通常是 DAO。

## 6. 部署脚本

### 6.1 部署使用现有代币的插件

使用 [DeployDrawPluginWithExistingTokens.s.sol](./script/DeployDrawPluginWithExistingTokens.s.sol) 脚本。

### 6.2 部署包含新代币的插件

使用 [DeployDrawPluginWithNewTokens.s.sol](./script/DeployWithNewTokensUnlimited.s.sol) 脚本：

```bash
DEPLOYMENT_SCRIPT=DeployDrawPluginWithNewTokens make deploy
```

## 7. 权限控制

插件使用以下角色进行权限控制：

- `DRAW_MANAGER_ROLE`：管理 NFT 组合、资格参数
- `BLACKLIST_MANAGER_ROLE`：维护黑名单
- `UPGRADER_ROLE`：触发合约升级

新部署的代币合约会自动配置必要的权限，确保 DAO 可以正常操作代币。

## 8. 开发指南

### 8.1 添加新的 NFT 组合

DAO 可以通过提案添加新的 NFT 兑换组合，组合包含：

- 组合 ID
- 包含的 NFT 单元（ID 和数量）
- 是否启用
- 最大兑换次数
- 单次最大兑换组数

### 8.2 设置发行上限

DAO 可以通过提案为特定 NFT ID 设置发行上限，防止过度发行。

### 8.3 更新资格参数

DAO 可以通过提案更新抽奖资格参数：

- 最小 Token 持有量
- 抽奖间隔时间
- 资格验证 Token

## 9. 前端集成指南

### 9.1 连接钱包和网络

前端应用需要连接到相应的区块链网络（如 Sepolia 测试网），并获取用户钱包地址。

### 9.2 通过前端创建 DAO 并安装插件

前端可以通过调用 Aragon OSx 的 DAO 工厂合约来创建 DAO 并安装插件：

```
// 创建DAO并安装插件
async function createDaoWithPlugin(signer) {
  try {
    // DAO工厂合约地址（Sepolia网络）
    const DAO_FACTORY_ADDRESS = "0x08158686169d0023c57804204fc8025aC923029c";

    // 插件仓库地址（之前已部署）
    const PLUGIN_REPO_ADDRESS = "0x..."; // 替换为实际部署的插件仓库地址

    // DAO工厂ABI
    const daoFactoryABI = [
      "function createDao(tuple(address,string,string,bytes) daoSettings, tuple(tuple(uint8,uint16,address),bytes)[] pluginSettings) returns (address, tuple(address,bytes4[])[])",
    ];

    // 获取DAO工厂合约实例
    const daoFactory = new ethers.Contract(
      DAO_FACTORY_ADDRESS,
      daoFactoryABI,
      signer
    );

    // 定义DAO设置
    const daoSettings = [
      ethers.constants.AddressZero, // trustedForwarder
      "", // daoURI
      "my-draw-dao-" + Date.now(), // subdomain (确保唯一性)
      ethers.utils.toUtf8Bytes(""), // metadata
    ];

    // 定义插件设置
    const pluginSettings = [
      {
        pluginSetupRef: {
          versionTag: { release: 1, build: 1 },
          pluginSetupRepo: PLUGIN_REPO_ADDRESS,
        },
        data: ethers.utils.defaultAbiCoder.encode(
          [
            "address",
            "address",
            "address",
            "uint256",
            "bool",
            "uint256",
            "uint256",
            "tuple(uint256,uint256[],bool,uint256,uint256,uint256)[]",
          ],
          [
            "0x1111111111111111111111111111111111111111", // tokenA地址 (ERC20)
            "0x2222222222222222222222222222222222222222", // tokenB地址 (ERC1155)
            "0x3333333333333333333333333333333333333333", // eligibleToken地址
            100, // minTokenAmount
            false, // isErc1155Eligible
            1, // eligibleNftId
            86400, // drawInterval (24小时)
            [
              {
                // NFT组合
                comboId: 1,
                nftUnits: [{ id: 1, unit: 1 }],
                isEnabled: true,
                maxExchangeCount: 100,
                maxSingleBatch: 10,
                currentExchangeCount: 0,
              },
            ],
          ]
        ),
      },
    ];

    // 发送创建DAO交易
    const tx = await daoFactory.createDao(daoSettings, pluginSettings);
    console.log("交易已发送，等待确认...");

    // 等待交易确认
    const receipt = await tx.wait();
    console.log("DAO创建成功:", receipt);

    // 从事件日志中提取DAO地址和插件地址
    const daoAddress = receipt.events[0].args[0];
    const installedPlugins = receipt.events[0].args[1];
    const pluginAddress = installedPlugins[0][0];

    console.log("DAO地址:", daoAddress);
    console.log("插件地址:", pluginAddress);

    return { daoAddress, pluginAddress };
  } catch (error) {
    console.error("创建DAO失败:", error);
    throw error;
  }
}
```

### 9.3 为已存在的 DAO 安装插件

如果 DAO 已经存在，可以通过 Plugin Setup Processor 为 DAO 安装插件：

```
// 为已存在的DAO安装插件
async function installPluginToExistingDao(daoAddress, signer) {
  try {
    // Plugin Setup Processor合约地址（Sepolia网络）
    const PSP_ADDRESS = "0x42B16649b8843255465b39199458964646508388";

    // 插件仓库地址（之前已部署）
    const PLUGIN_REPO_ADDRESS = "0x..."; // 替换为实际部署的插件仓库地址

    // PSP ABI
    const pspABI = [
      "function prepareInstallation(address dao, tuple(tuple(uint8,uint16,address) versionTag, bytes data) params) view returns (address, tuple(uint8,address,address,bytes32,bytes32)[])",
      "function applyInstallation(address dao, tuple(tuple(uint8,uint16,address) versionTag, address plugin, tuple(uint8,address,address,bytes32,bytes32)[] permissions, bytes32 helpersHash) params)",
    ];

    // 获取PSP合约实例
    const psp = new ethers.Contract(PSP_ADDRESS, pspABI, signer);

    // 准备插件安装参数
    const prepareParams = {
      versionTag: { release: 1, build: 1 },
      data: ethers.utils.defaultAbiCoder.encode(
        [
          "address",
          "address",
          "address",
          "uint256",
          "bool",
          "uint256",
          "uint256",
          "tuple(uint256,uint256[],bool,uint256,uint256,uint256)[]",
        ],
        [
          "0x1111111111111111111111111111111111111111", // tokenA地址 (ERC20)
          "0x2222222222222222222222222222222222222222", // tokenB地址 (ERC1155)
          "0x3333333333333333333333333333333333333333", // eligibleToken地址
          100, // minTokenAmount
          false, // isErc1155Eligible
          1, // eligibleNftId
          86400, // drawInterval (24小时)
          [
            {
              // NFT组合
              comboId: 1,
              nftUnits: [{ id: 1, unit: 1 }],
              isEnabled: true,
              maxExchangeCount: 100,
              maxSingleBatch: 10,
              currentExchangeCount: 0,
            },
          ],
        ]
      ),
    };

    // 准备安装
    const [pluginAddress, permissions] = await psp.prepareInstallation(
      daoAddress,
      {
        versionTag: prepareParams.versionTag,
        pluginSetupRepo: PLUGIN_REPO_ADDRESS,
        data: prepareParams.data,
      }
    );

    console.log("准备安装完成，插件地址:", pluginAddress);

    // 应用安装
    const applyTx = await psp.applyInstallation(daoAddress, {
      versionTag: prepareParams.versionTag,
      pluginSetupRepo: PLUGIN_REPO_ADDRESS,
      plugin: pluginAddress,
      permissions: permissions,
      helpersHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("")), // 空helpers hash
    });

    console.log("插件安装交易已发送，等待确认...");
    const applyReceipt = await applyTx.wait();
    console.log("插件安装成功:", applyReceipt);

    return pluginAddress;
  } catch (error) {
    console.error("插件安装失败:", error);
    throw error;
  }
}
```

### 9.4 与插件交互

插件提供以下核心方法供前端调用：

#### 9.4.1 NFT 抽奖

```
// 抽奖函数
async function drawNFT(pluginAddress, signer) {
  const plugin = new ethers.Contract(pluginAddress, drawPluginABI, signer);

  // 生成签名（防止重放攻击）
  const messageHash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "uint256"],
    [
      await signer.getAddress(),
      (await ethers.provider.getNetwork()).chainId,
      Math.floor(Date.now() / 1000),
    ]
  );

  const signature = await signer.signMessage(
    ethers.utils.arrayify(messageHash)
  );

  // 调用抽奖函数
  const tx = await plugin.drawNFT(signature);
  await tx.wait();

  console.log("NFT抽奖成功");
}
```

#### 9.4.2 NFT 批量兑换

```
// 批量兑换函数
async function exchangeToken(pluginAddress, comboId, batchCount, signer) {
  const plugin = new ethers.Contract(pluginAddress, drawPluginABI, signer);

  // 生成签名
  const messageHash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "uint256"],
    [
      await signer.getAddress(),
      (await ethers.provider.getNetwork()).chainId,
      Math.floor(Date.now() / 1000),
    ]
  );

  const signature = await signer.signMessage(
    ethers.utils.arrayify(messageHash)
  );

  // 调用兑换函数
  const tx = await plugin.exchangeToken(comboId, batchCount, signature);
  await tx.wait();

  console.log("NFT兑换成功");
}
```

#### 9.4.3 查询有效 NFT ID 列表

```
// 获取有效NFT ID列表
async function getValidNftIds(pluginAddress, provider) {
  const plugin = new ethers.Contract(pluginAddress, drawPluginABI, provider);
  const ids = await plugin.getValidNftIds();
  return ids;
}
```

#### 9.4.4 查询 NFT 发行情况

```
// 获取NFT发行情况
async function getNftSupply(pluginAddress, nftId, provider) {
  const plugin = new ethers.Contract(pluginAddress, drawPluginABI, provider);
  const [current, max] = await plugin.getNftSupply(nftId);
  return { current: current.toNumber(), max: max.toNumber() };
}
```

### 9.5 DAO 治理接口

DAO 管理员可以通过以下方法管理插件：

#### 9.5.1 更新资格参数

```
// 更新资格验证参数
async function updateEligibilityParam(
  pluginAddress,
  paramName,
  newValue,
  signer
) {
  const plugin = new ethers.Contract(pluginAddress, drawPluginABI, signer);
  const tx = await plugin.updateEligibilityParam(paramName, newValue);
  await tx.wait();
}
```

#### 9.5.2 管理黑名单

```
// 更新黑名单
async function updateBlacklist(pluginAddress, users, isBlacklisted, signer) {
  const plugin = new ethers.Contract(pluginAddress, drawPluginABI, signer);
  const tx = await plugin.updateBlacklist(users, isBlacklisted);
  await tx.wait();
}
```

#### 9.5.3 更新 NFT 组合

```
// 更新NFT组合
async function updateNFTCombo(
  pluginAddress,
  comboId,
  isEnabled,
  maxSingleBatch,
  maxExchangeCount,
  signer
) {
  const plugin = new ethers.Contract(pluginAddress, drawPluginABI, signer);
  const tx = await plugin.updateNFTCombo(
    comboId,
    isEnabled,
    maxSingleBatch,
    maxExchangeCount
  );
  await tx.wait();
}
```

#### 9.5.4 设置 NFT 发行上限

```
// 设置NFT发行上限
async function setNFTMaxSupply(pluginAddress, nftId, maxSupply, signer) {
  const plugin = new ethers.Contract(pluginAddress, drawPluginABI, signer);
  const tx = await plugin.setNFTMaxSupply(nftId, maxSupply);
  await tx.wait();
}
```

## 10. 测试

运行测试：

```
# 运行单元测试
make test

# 运行分叉测试（需要配置RPC_URL）
make test-fork
```

## 11. 安全考虑

1. 随机数生成融合多种随机源，降低预测风险
2. 所有参数变更需 DAO 提案通过
3. 支持合约升级但需严格权限控制
4. 发行上限和黑名单机制防止恶意操作
5. 条件部署机制确保代币合约的安全创建和权限配置

## 12. 完整前端示例

```
<!DOCTYPE html>
<html>
  <head>
    <title>DAO抽奖插件前端示例</title>
    <script
      src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js"
      type="application/javascript"
    ></script>
  </head>
  <body>
    <div id="app">
      <h1>DAO抽奖插件前端示例</h1>
      <button id="connectWallet">连接钱包</button>
      <div id="actions" style="display:none;">
        <button id="createDao">创建DAO并安装插件</button>
        <button id="installPlugin">为现有DAO安装插件</button>
        <input type="text" id="daoAddress" placeholder="输入DAO地址" />
        <button id="drawNFT">抽奖</button>
        <button id="exchangeToken">兑换Token</button>
        <div id="status"></div>
      </div>
    </div>

    <script>
      let signer = null;
      let pluginAddress = null;

      // 插件ABI（简化示例）
      const drawPluginABI = [
        "function drawNFT(bytes) returns (bool,uint256,uint256,string)",
        "function exchangeToken(uint256,uint256,bytes) returns (bool,uint256,string)",
        "function getValidNftIds() view returns (uint256[])",
        "function getNftSupply(uint256) view returns (uint256,uint256)",
      ];

      document
        .getElementById("connectWallet")
        .addEventListener("click", async () => {
          if (typeof window.ethereum !== "undefined") {
            try {
              await window.ethereum.request({ method: "eth_requestAccounts" });
              const provider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              signer = provider.getSigner();
              document.getElementById("connectWallet").style.display = "none";
              document.getElementById("actions").style.display = "block";
              document.getElementById("status").innerHTML = "钱包连接成功";
            } catch (error) {
              console.error("连接失败", error);
              document.getElementById("status").innerHTML =
                "连接失败: " + error.message;
            }
          } else {
            document.getElementById("status").innerHTML = "请安装MetaMask钱包";
          }
        });

      document
        .getElementById("createDao")
        .addEventListener("click", async () => {
          if (!signer) {
            document.getElementById("status").innerHTML = "请先连接钱包";
            return;
          }

          document.getElementById("status").innerHTML =
            "正在创建DAO并安装插件...";

          try {
            // 这里调用创建DAO的函数
            // const result = await createDaoWithPlugin(signer);
            // pluginAddress = result.pluginAddress;
            document.getElementById("status").innerHTML =
              "功能示例，请参考文档实现完整代码";
          } catch (error) {
            console.error("创建失败", error);
            document.getElementById("status").innerHTML =
              "创建失败: " + error.message;
          }
        });

      document
        .getElementById("installPlugin")
        .addEventListener("click", async () => {
          if (!signer) {
            document.getElementById("status").innerHTML = "请先连接钱包";
            return;
          }

          const daoAddress = document.getElementById("daoAddress").value;
          if (!daoAddress) {
            document.getElementById("status").innerHTML = "请输入DAO地址";
            return;
          }

          document.getElementById("status").innerHTML = "正在为DAO安装插件...";

          try {
            // 这里调用安装插件的函数
            // pluginAddress = await installPluginToExistingDao(daoAddress, signer);
            document.getElementById("status").innerHTML =
              "功能示例，请参考文档实现完整代码";
          } catch (error) {
            console.error("安装失败", error);
            document.getElementById("status").innerHTML =
              "安装失败: " + error.message;
          }
        });

      document.getElementById("drawNFT").addEventListener("click", async () => {
        if (!signer || !pluginAddress) {
          document.getElementById("status").innerHTML = "请先创建DAO并安装插件";
          return;
        }

        document.getElementById("status").innerHTML = "正在抽奖...";

        try {
          // 这里调用抽奖函数
          // await drawNFT(pluginAddress, signer);
          document.getElementById("status").innerHTML =
            "功能示例，请参考文档实现完整代码";
        } catch (error) {
          console.error("抽奖失败", error);
          document.getElementById("status").innerHTML =
            "抽奖失败: " + error.message;
        }
      });

      document
        .getElementById("exchangeToken")
        .addEventListener("click", async () => {
          if (!signer || !pluginAddress) {
            document.getElementById("status").innerHTML =
              "请先创建DAO并安装插件";
            return;
          }

          document.getElementById("status").innerHTML = "正在兑换Token...";

          try {
            // 这里调用兑换函数
            // await exchangeToken(pluginAddress, 1, 1, signer);
            document.getElementById("status").innerHTML =
              "功能示例，请参考文档实现完整代码";
          } catch (error) {
            console.error("兑换失败", error);
            document.getElementById("status").innerHTML =
              "兑换失败: " + error.message;
          }
        });
    </script>
  </body>
</html>
```

## 13. IPFS 元数据发布说明

### 13.1 插件元数据结构

插件在 Aragon 生态系统中需要提供元数据，包括名称、描述和图标等信息。这些元数据需要发布到 IPFS 并使用 CID 哈希引用。

示例元数据文件结构：

```
{
  "name": "Draw Plugin",
  "description": "NFT抽奖和批量兑换插件",
  "icons": [
    {
      "src": "icon.png",
      "sizes": "256x256",
      "type": "image/png"
    }
  ]
}
```

### 13.2 发布到 IPFS 的步骤

1. 准备元数据文件和图标文件
2. 使用 IPFS 客户端或在线服务上传文件
3. 获取文件的 CID 哈希
4. 在部署脚本中使用 CID 作为 releaseMetadata 和 buildMetadata 参数

### 13.3 部署脚本中的 IPFS 集成

当前部署脚本中存在一个问题，即在调用`createPluginRepoWithFirstVersion`时传递了空字符串而不是实际的 IPFS 哈希。正确的做法应该是：

```
// 发布release元数据到IPFS，获得CID
string memory releaseMetadataCID = "ipfs://Qm..."; // 实际的IPFS CID

// 发布build元数据到IPFS，获得CID
string memory buildMetadataCID = "ipfs://Qm..."; // 实际的IPFS CID

// 使用实际的CID而不是空字符串
drawPluginRepo = pluginRepoFactory.createPluginRepoWithFirstVersion(
    pluginEnsSubdomain,
    address(drawPluginSetup),
    pluginRepoMaintainerAddress,
    releaseMetadataCID,
    buildMetadataCID
);
```

### 13.4 前端访问 IPFS 元数据

前端应用可以通过 IPFS 网关访问插件元数据：

```
// 通过IPFS网关获取插件元数据
async function fetchPluginMetadata(cid) {
  const gatewayUrl = `https://ipfs.io/ipfs/${cid}`;
  try {
    const response = await fetch(gatewayUrl);
    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error("获取元数据失败:", error);
    return null;
  }
}
```

## 14. 实际 IPFS 上传操作指南

### 14.1 准备元数据文件

项目中已包含以下文件用于 IPFS 上传：

- `plugin-metadata.json` - 插件元数据文件
- `icon.png` - 插件图标文件

### 14.2 使用命令行工具上传到 IPFS

1. 安装 IPFS 命令行工具：

```bash
# 安装ipfs-desktop或命令行版本
brew install ipfs # macOS
# 或从 https://docs.ipfs.tech/install/command-line/ 下载
```

2. 启动 IPFS 守护进程：

```bash
ipfs daemon
```

3. 上传文件到 IPFS：

```bash
# 上传图标文件
ipfs add icon.png
# 输出类似：Qm...  icon.png

# 上传元数据文件（需要先更新其中的图标引用）
ipfs add plugin-metadata.json
# 输出类似：Qm...  plugin-metadata.json
```

4. 更新元数据文件中的图标引用：

```
{
  "name": "Draw Plugin",
  "description": "NFT抽奖和批量兑换插件，支持ERC1155代币的随机抽取和批量兑换功能",
  "icons": [
    {
      "src": "ipfs://Qm.../icon.png", // 使用上一步获得的CID
      "sizes": "256x256",
      "type": "image/png"
    }
  ]
}
```

### 14.3 使用在线 IPFS 服务

如果不方便本地安装 IPFS，可以使用在线服务如：

- [Pinata](https://www.pinata.cloud/)
- [Infura IPFS](https://infura.io/product/ipfs)
- [NFT.Storage](https://nft.storage/)

### 14.4 更新部署脚本

上传文件后，需要更新部署脚本中的 CID：

```
// 在DeployDrawPlugin.s.sol中更新以下行：
bytes memory releaseMetadata = "ipfs://YOUR_RELEASE_METADATA_CID_HERE";
bytes memory buildMetadata = "ipfs://YOUR_BUILD_METADATA_CID_HERE";
```

### 14.5 验证 IPFS 上传

可以通过 IPFS 网关验证上传的文件：

```
https://ipfs.io/ipfs/YOUR_CID_HERE
```

## 15. 部署 artifact 管理

### 15.1 自动生成带时间戳的部署信息文件

为了解决多次部署时文件名重复的问题，系统现在会在每次部署完成后自动生成一个带时间戳的唯一部署信息文件。

文件命名格式：`deployment-info-YYYYMMDD-HHMM.json`
例如：deployment-info-20250928-2200.json

### 15.2 自动提取合约地址

系统使用 extract-deployment-info.sh 脚本自动从部署日志中提取以下合约地址：

- ERC20PresetUnlimitedBase
- ERC1155PresetMinterPauserWithURIControlBase
- DrawPluginSetup
- DrawContractImpl
- PluginInstance (代理合约)
- PluginRepo (插件仓库)

### 15.3 部署流程集成

在 Makefile 的 `deploy-new-tokens` 目标中，部署流程已集成自动调用提取脚本的功能。插件 ENS 子域名通过环境变量 `PLUGIN_ENS_SUBDOMAIN` 配置，默认值为 "draw"，部署时优先读取该环境变量以支持自定义子域名，确保灵活性和可重复部署性：

```
deploy-new-tokens: test ## Deploy with new token contracts and generate timestamped artifact file
	@echo "Starting the deployment with new token contracts"
	@mkdir -p $(LOGS_FOLDER) $(ARTIFACTS_FOLDER)
	DEPLOYMENT_SCRIPT=DeployWithNewTokensUnlimited forge script script/DeployWithNewTokensUnlimited.s.sol:DeployDrawPluginWithNewTokensUnlimited \
		--rpc-url $(RPC_URL) \
		--retries 10 \
		--delay 8 \
		--broadcast \
		--verify \
		$(VERIFIER_PARAMS) \
		$(FORGE_BUILD_CUSTOM_PARAMS) \
		$(FORGE_SCRIPT_CUSTOM_PARAMS) \
		$(VERBOSITY) 2>&1 | tee -a $(LOGS_FOLDER)/$(DEPLOYMENT_LOG_FILE)
	@echo "Generating deployment artifact with timestamp..."
	@TIMESTAMP=$$(date +%Y%m%d-%H%M) && \
	./script/extract-deployment-info.sh $(LOGS_FOLDER)/$(DEPLOYMENT_LOG_FILE) $(ARTIFACTS_FOLDER) $${TIMESTAMP}
```

### 15.4 部署信息文件内容示例

生成的部署信息文件包含以下内容：

```
{
  "network": "sepolia",
  "chainId": 11155111,
  "deploymentDate": "Sun Sep 28 21:18:24 CST 2025",
  "contracts": {
    "ERC20PresetUnlimitedBase": {
      "address": "0xb20fd3a78882f151f000880C1f6e7CF1DcfC557C",
      "type": "ERC20 Token Base Contract"
    },
    "ERC1155PresetMinterPauserWithURIControlBase": {
      "address": "0xbFADdfCa534Aec18C1c51D353Fb395edBE9777a0",
      "type": "ERC1155 Token Base Contract"
    },
    "DrawPluginSetup": {
      "address": "0xF09912662b39f31D8Bf3ccC8C9f8f1e424a1770C",
      "type": "Plugin Setup Contract"
    },
    "DrawContractImpl": {
      "address": "0x06cF13b10143e89f3f9ADc1aAd0de285AAE8A8c0",
      "type": "Plugin Implementation Contract"
    },
    "PluginInstance": {
      "address": "0xa031c5de83219B45F84E76850D2F37e3bf438b92",
      "type": "Plugin Instance (Proxy)"
    },
    "PluginRepo": {
      "address": "0x75E5f0c46789c6ec68F7A3991332FE03d4E9af6c",
      "type": "Plugin Repository"
    }
  },
  "deploymentScript": "DeployWithNewTokensUnlimited.s.sol",
  "subdomain": "draw-4"
}
```

### 15.5 查看历史部署记录

所有历史部署记录都保存在 artifacts 目录中，可以通过以下命令查看：

```bash
ls -la artifacts/deployment-info-*.json
```

这确保了每次部署都有独立的记录文件，避免了文件覆盖问题，同时保留了完整的部署历史记录。

## 16. 网络部署配置

### 16.1 环境变量配置

在进行网络部署时，需要配置以下环境变量：

#### 基础配置

```
# NETWORK AND ACCOUNT(s)
DEPLOYMENT_PRIVATE_KEY="YOUR_PRIVATE_KEY_HERE"
REFUND_ADDRESS=""

# Used by Foundry
RPC_URL="https://your-rpc-endpoint.com"
CHAIN_ID="NETWORK_CHAIN_ID"

# Used for log file names
NETWORK_NAME="network-name"
```

#### 源码验证配置

```
# SOURCE VERIFICATION
VERIFIER="etherscan"  # 或其他验证器
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
```

#### 依赖合约地址

```
# Deployed dependencies
DAO_FACTORY_ADDRESS="DAO_FACTORY_CONTRACT_ADDRESS"
PLUGIN_REPO_FACTORY_ADDRESS="PLUGIN_REPO_FACTORY_CONTRACT_ADDRESS"
PLUGIN_SETUP_PROCESSOR_ADDRESS="PLUGIN_SETUP_PROCESSOR_CONTRACT_ADDRESS"
```

#### 插件仓库设置

```
# PLUGIN REPO SETTINGS
PLUGIN_ENS_SUBDOMAIN="draw"  # 插件ENS子域名，根据项目要求必须为"draw"
PLUGIN_REPO_MAINTAINER_ADDRESS="MAINTAINER_ADDRESS"
```

### 16.2 主网部署

#### 主网环境配置

```
# NETWORK AND ACCOUNT(s)
DEPLOYMENT_PRIVATE_KEY="YOUR_MAINNET_PRIVATE_KEY_HERE"
RPC_URL="https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY"
CHAIN_ID="1"
NETWORK_NAME="mainnet"

# SOURCE VERIFICATION
VERIFIER="etherscan"
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"

# Deployed dependencies (Mainnet addresses)
DAO_FACTORY_ADDRESS="0x470556d2699A1c9d52770a82745662E626042113"
PLUGIN_REPO_FACTORY_ADDRESS="0x4349505315565cB5584D04e346506e5232578645"
PLUGIN_SETUP_PROCESSOR_ADDRESS="0x87635933F976854f8911D1910b3b9f7314d30a52"

# PLUGIN REPO SETTINGS
PLUGIN_ENS_SUBDOMAIN="draw"
PLUGIN_REPO_MAINTAINER_ADDRESS="YOUR_MAINTAINER_ADDRESS_HERE"
```

#### 主网部署命令

```bash
# 使用主网配置文件运行部署脚本
source .env.mainnet && forge script script/DeployWithNewTokensUnlimited.s.sol:DeployDrawPluginWithNewTokensUnlimited \
  --rpc-url $RPC_URL \
  --private-key $DEPLOYMENT_PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvvv

# 或者使用Makefile命令
source .env.mainnet && make deploy-new-tokens
```

#### 主网部署注意事项

1. **Gas 费用**: 主网部署需要支付实际的 Gas 费用，请确保部署账户有足够的 ETH
2. **合约验证**: 建议配置 ETHERSCAN_API_KEY 以便自动验证合约
3. **权限管理**: 主网部署后，确保正确设置插件仓库的维护者权限
4. **备份**: 部署前请备份所有重要的私钥和地址信息
5. **测试**: 强烈建议先在测试网（如 Sepolia）上完整测试部署流程

### 16.3 Polygon 网络部署

#### Polygon 网络信息

- **网络名称**: Polygon Mainnet
- **链 ID**: 137
- **RPC 端点**: https://polygon-rpc.com
- **区块浏览器**: https://polygonscan.com

#### Polygon 环境配置

```
# NETWORK AND ACCOUNT(s)
DEPLOYMENT_PRIVATE_KEY="YOUR_POLYGON_PRIVATE_KEY_HERE"
RPC_URL="https://polygon-rpc.com"
CHAIN_ID="137"
NETWORK_NAME="polygon"

# SOURCE VERIFICATION
VERIFIER="etherscan"
ETHERSCAN_API_KEY="YOUR_POLYGONSCAN_API_KEY"

# Deployed dependencies
DAO_FACTORY_ADDRESS="0x470556d2699A1c9d52770a82745662E626042113"
PLUGIN_REPO_FACTORY_ADDRESS="0x4349505315565cB5584D04e346506e5232578645"
PLUGIN_SETUP_PROCESSOR_ADDRESS="0x87635933F976854f8911D1910b3b9f7314d30a52"

# PLUGIN REPO SETTINGS
PLUGIN_ENS_SUBDOMAIN="draw"
PLUGIN_REPO_MAINTAINER_ADDRESS="YOUR_MAINTAINER_ADDRESS_HERE"
```

#### Polygon 部署命令

```
# 使用Polygon配置文件运行部署脚本
source .env.polygon && forge script script/DeployWithNewTokensUnlimited.s.sol:DeployDrawPluginWithNewTokensUnlimited \
  --rpc-url $RPC_URL \
  --private-key $DEPLOYMENT_PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvvv

# 或者使用Makefile命令
source .env.polygon && make deploy-new-tokens
```

#### Polygon 部署注意事项

1. **网络稳定性**: Polygon 网络有时会出现拥堵，请选择网络相对空闲的时间进行部署
2. **Gas 费用**: 虽然 Polygon 费用较低，但在网络拥堵时仍可能上升
3. **合约验证**: 建议配置 Polygonscan API 密钥以便自动验证合约
4. **权限管理**: Polygon 部署后，确保正确设置插件仓库的维护者权限
5. **备份**: 部署前请备份所有重要的私钥和地址信息
6. **测试**: 强烈建议先在 Mumbai 测试网（Polygon 测试网）上完整测试部署流程

### 16.4 测试网部署

#### Sepolia 测试网配置示例

```
# NETWORK AND ACCOUNT(s)
DEPLOYMENT_PRIVATE_KEY="YOUR_SEPOLIA_PRIVATE_KEY_HERE"
RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"
CHAIN_ID="11155111"
NETWORK_NAME="sepolia"

# SOURCE VERIFICATION
VERIFIER="etherscan"
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"

# Deployed dependencies (Sepolia addresses)
DAO_FACTORY_ADDRESS="0x08158686169d0023c57804204fc8025aC923029c"
PLUGIN_REPO_FACTORY_ADDRESS="0x4349505315565cB5584D04e346506e5232578645"
PLUGIN_SETUP_PROCESSOR_ADDRESS="0x42B16649b8843255465b39199458964646508388"

# PLUGIN REPO SETTINGS
PLUGIN_ENS_SUBDOMAIN="draw"
PLUGIN_REPO_MAINTAINER_ADDRESS="YOUR_MAINTAINER_ADDRESS_HERE"
```

#### Sepolia 部署命令

```
# 使用Sepolia配置文件运行部署脚本
source .env && forge script script/DeployWithNewTokensUnlimited.s.sol:DeployDrawPluginWithNewTokensUnlimited \
  --rpc-url $RPC_URL \
  --private-key $DEPLOYMENT_PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvvv

# 或者使用Makefile命令
make deploy-new-tokens
```

### 16.5 部署后验证

部署完成后，可以通过以下方式验证部署是否成功：

1. 检查部署日志文件是否生成
2. 验证生成的 artifact 文件是否包含正确的合约地址
3. 在区块链浏览器上验证合约是否已正确部署
4. 检查合约是否已正确验证

## 17. 插件子域名要求和冲突解决

### 17.1 插件子域名要求

根据项目要求，插件子域名必须硬编码为 "draw"。部署脚本已配置为使用此子域名。

### 177.2 子域名冲突问题

如果遇到子域名冲突（例如 "draw" 子域名已被注册），可以采用以下解决方案：

#### 方案一：通过 DAO 治理注销现有注册（推荐）

1. **创建治理提案**

   - 在 DAO 界面创建新的治理提案
   - 提案内容：请求注销已注册的 "draw" 插件仓库
   - 说明注销原因和必要性

2. **社区投票**

   - 等待社区成员对提案进行投票
   - 确保获得足够的票数通过提案

3. **执行注销**

   - 提案通过后，执行注销操作
   - 清理相关的 ENS 子域名注册

4. **重新部署**
   - 使用 "draw" 子域名重新部署插件

#### 方案二：使用临时子域名

如果无法立即注销现有注册，可以使用临时子域名：

1. **部署时使用唯一标识**

   ```solidity
   string memory uniqueSubdomain = "draw-temp";
   ```

2. **等待治理流程完成**

   - 同时进行 DAO 治理提案流程
   - 注销 "draw" 子域名

3. **后期切换**
   - 治理完成后，重新部署使用 "draw"

#### 方案三：使用时间戳唯一子域名

作为临时解决方案，可以使用带时间戳的唯一子域名：

```
string memory uniqueSubdomain = string(abi.encodePacked("draw-", toString(block.timestamp)));
```

### 17.3 实施步骤

#### 1. 检查当前注册状态

使用以下命令检查子域名是否已被注册：

```bash
# 检查ENS注册状态
cast call <ENS_REGISTRY_ADDRESS> "owner(bytes32)" <SUBDOMAIN_HASH>
```

#### 2. 创建 DAO 提案模板

提案应包含以下内容：

- 标题：注销已注册的 "draw" 插件仓库
- 描述：说明冲突问题和解决方案
- 执行操作：调用 PluginRepoRegistry 的注销方法
- 理由：为重新使用 "draw" 子域名做准备

#### 3. 部署脚本配置

确保部署脚本使用正确的子域名：

```solidity
string memory subdomain = "draw";
PluginRepo pluginRepo = pluginRepoFactory.createPluginRepo(subdomain, pluginSetupAddress);
```

### 17.4 注意事项

1. **权限要求**

   - 注销操作需要相应的 DAO 权限
   - 确保执行账户具有必要的权限

2. **时间考虑**

   - DAO 治理流程可能需要数天时间
   - 提前规划部署时间表

3. **回退方案**
   - 准备临时子域名方案
   - 确保业务连续性

## 18. 使用 Makefile 管理部署

### 18.1 Makefile 目标

项目提供了以下 Makefile 目标来管理部署流程：

```
- make deploy             # 部署协议，验证源代码并写入 ./artifacts
- make deploy-new-tokens  # 使用新代币合约部署
- make resume             # 重试待处理的部署交易，验证代码并写入 ./artifacts
```

### 18.2 部署新代币

使用 `deploy-new-tokens` 目标可以部署包含新代币的插件：

```bash
make deploy-new-tokens
```

此命令会：

1. 运行测试确保代码正确
2. 部署新的 ERC20 和 ERC1155 代币合约
3. 部署插件仓库和设置合约
4. 通过 Plugin Setup Processor 安装插件
5. 自动生成带时间戳的部署 artifact 文件

### 18.3 恢复部署

如果部署过程中断，可以使用 `resume` 目标恢复部署：

```bash
make resume
```

## 19. 合约验证

### 19.1 Etherscan 验证

使用以下命令验证在 Etherscan 兼容浏览器上的最后部署：

```bash
make verify-etherscan
```

### 19.2 BlockScout 验证

使用以下命令验证在 BlockScout 上的最后部署：

```bash
make verify-blockscout
```

### 19.3 Sourcify 验证

使用以下命令验证在 Sourcify 上的最后部署：

```bash
make verify-sourcify
```

## 20. 故障排除

### 20.1 常见部署问题

#### 1. 部署时出现"insufficient funds for gas \* price + value"错误

解决方案：确保部署账户有足够的代币支付 Gas 费用。

#### 2. 合约验证失败

解决方案：

- 检查 ETHERSCAN_API_KEY 是否正确配置
- 确认使用的编译器版本与部署时一致
- 手动在区块链浏览器上验证合约

#### 3. RPC 连接问题

解决方案：

- 尝试使用其他 RPC 提供商
- 检查网络连接是否正常

### 20.2 日志分析

部署过程中会生成详细的日志文件，可以帮助诊断问题：

- 部署日志保存在 `logs` 目录中
- 广播信息保存在 `broadcast` 目录中
- 敏感信息（如私钥）保存在 `cache` 目录中

可以通过以下命令查看最近的部署日志：

```bash
tail -f logs/deployment-*.log
```

## 21. 最佳实践

### 21.1 部署前检查清单

在进行部署之前，请确保完成以下检查：

1. [ ] 环境变量已正确配置
2. [ ] 私钥具有足够的余额支付 Gas 费用
3. [ ] 依赖合约地址已正确设置
4. [ ] 插件子域名符合项目要求
5. [ ] 已在测试网上成功测试过部署流程
6. [ ] 备份了所有重要的私钥和地址信息

### 21.2 安全建议

1. **私钥管理**

   - 永远不要将私钥提交到版本控制系统
   - 使用硬件钱包或安全的密钥管理服务
   - 为不同的网络使用不同的私钥

2. **权限控制**

   - 遵循最小权限原则
   - 定期审查和更新权限设置
   - 为关键操作设置多重签名要求

3. **代码验证**
   - 在主网部署前，确保所有合约都已通过验证
   - 仔细检查验证结果，确保与源代码一致

### 21.3 维护建议

1. **定期更新**

   - 跟踪 Aragon OSx 框架的更新
   - 及时应用安全补丁
   - 定期审查和更新依赖项

2. **监控和日志**

   - 设置监控警报以检测异常活动
   - 定期审查部署日志
   - 保留历史部署记录以供审计

3. **文档维护**
   - 随着功能更新及时更新文档
   - 记录所有重要的部署和配置变更
   - 为团队成员提供清晰的操作指南

## 22. 附录

### 22.1 相关文件

- [Makefile](./Makefile) - 项目构建和部署配置
- [script/DeployWithNewTokensUnlimited.s.sol](./script/DeployWithNewTokensUnlimited.s.sol) - 部署脚本
- [script/extract-deployment-info.sh](./script/extract-deployment-info.sh) - 部署信息提取脚本
- [.env.example](./.env.example) - 环境变量配置示例
- [.env.mainnet.example](./.env.mainnet.example) - 主网环境变量配置示例
- [.env.polygon.example](./.env.polygon.example) - Polygon 环境变量配置示例

### 22.2 术语表

- **DAO**: 去中心化自治组织
- **ENS**: 以太坊域名服务
- **ERC20**: 以太坊代币标准
- **ERC1155**: 以太坊多代币标准
- **IPFS**: 星际文件系统
- **NFT**: 非同质化代币
- **Plugin**: 插件
- **Repo**: 仓库
- **UUPS**: 统一可升级代理标准
