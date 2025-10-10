# ICO Plugin Utilities

## 概述

ICO 插件工具函数提供了一套完整的功能来处理 ICO 相关的业务逻辑，包括批次管理、购买验证、金额计算等。

## 工具函数

### isBatchActive(batch: SalesBatch): boolean

检查销售批次是否处于活动状态。

**参数:**
- `batch`: 销售批次对象

**返回值:**
- `boolean`: 如果批次处于活动状态返回 true，否则返回 false

**使用示例:**
```typescript
import { icoUtils } from '@/plugins/icoPlugin';

const batch = {
  isActive: true,
  startTime: new Date(Date.now() - 10000),
  endTime: new Date(Date.now() + 10000),
  soldAmount: 100,
  totalLimit: 1000
};

const isActive = icoUtils.isBatchActive(batch);
console.log(isActive); // true
```

### calculateMaxPurchaseAmount(batch: SalesBatch, userPreviousPurchases: number = 0): number

计算用户可购买的最大数量。

**参数:**
- `batch`: 销售批次对象
- `userPreviousPurchases`: 用户已购买数量（默认为 0）

**返回值:**
- `number`: 用户可购买的最大数量

**使用示例:**
```typescript
import { icoUtils } from '@/plugins/icoPlugin';

const batch = {
  userLimit: 100,
  totalLimit: 1000,
  soldAmount: 200
};

const maxAmount = icoUtils.calculateMaxPurchaseAmount(batch, 30);
console.log(maxAmount); // 70
```

### validatePurchase(batch: SalesBatch, amount: number, userPreviousPurchases: number = 0): { isValid: boolean; errorMessage?: string }

验证购买请求是否有效。

**参数:**
- `batch`: 销售批次对象
- `amount`: 购买数量
- `userPreviousPurchases`: 用户已购买数量（默认为 0）

**返回值:**
- `object`: 包含验证结果的对象
  - `isValid`: 验证是否通过
  - `errorMessage`: 错误消息（如果验证失败）

**使用示例:**
```typescript
import { icoUtils } from '@/plugins/icoPlugin';

const batch = {
  isActive: true,
  startTime: new Date(Date.now() - 10000),
  endTime: new Date(Date.now() + 10000),
  userLimit: 100,
  soldAmount: 200,
  totalLimit: 1000
};

const result = icoUtils.validatePurchase(batch, 50, 30);
if (result.isValid) {
  console.log('Purchase is valid');
} else {
  console.log('Purchase invalid:', result.errorMessage);
}
```

### calculateExchangeAmount(amount: number, exchangeRate: number): number

计算兑换数量。

**参数:**
- `amount`: 购买数量
- `exchangeRate`: 兑换率

**返回值:**
- `number`: 兑换得到的数量

**使用示例:**
```typescript
import { icoUtils } from '@/plugins/icoPlugin';

const amount = 5;
const exchangeRate = 1000;
const result = icoUtils.calculateExchangeAmount(amount, exchangeRate);
console.log(result); // 5000
```

### formatTokenAmount(amount: number, decimals: number): string

格式化代币数量（考虑小数位数）。

**参数:**
- `amount`: 代币数量
- `decimals`: 小数位数

**返回值:**
- `string`: 格式化后的代币数量字符串

**使用示例:**
```typescript
import { icoUtils } from '@/plugins/icoPlugin';

const amount = 123456789;
const decimals = 18;
const result = icoUtils.formatTokenAmount(amount, decimals);
console.log(result); // '0.000000123456789000'
```

### parseTokenAmount(amount: string, decimals: number): number

解析代币数量（考虑小数位数）。

**参数:**
- `amount`: 代币数量字符串
- `decimals`: 小数位数

**返回值:**
- `number`: 解析后的代币数量

**使用示例:**
```typescript
import { icoUtils } from '@/plugins/icoPlugin';

const amount = '0.000000123456789';
const decimals = 18;
const result = icoUtils.parseTokenAmount(amount, decimals);
console.log(result); // 123456789
```

## 交易工具

### icoTransactionUtils

ICO 交易工具提供了与区块链交互的功能。

#### buildPrepareInstallData(params: IPrepareIcoInstallDataParams): Hex

构建准备安装插件的交易数据。

#### buildPrepareUpdateData(params: IBuildPreparePluginUpdateDataParams): Hex

创建插件更新数据。

## ABI 定义

### icoPluginSetupAbi

ICO 插件设置参数的 ABI 定义。

### icoPluginAbi

ICO 插件主要功能的 ABI 定义。

### icoPluginEventsAbi

ICO 插件事件的 ABI 定义。

## 常量

### icoPlugin

ICO 插件配置信息，包括不同网络的仓库地址等。

### ERROR_MESSAGES

错误消息常量，用于统一错误处理。