# ICO Plugin

## 功能概述

ICO 插件为 DAO 提供了一个完整的首次代币发行（ICO）管理系统，允许 DAO 管理交易对、兑换比率和销售批次。

## 核心功能

### 1. 交易对管理
- DAO 可以定义销售资产（治理代币）和购买资产（如 ETH、USDC 等）之间的交易对
- 支持自定义兑换比率设置

### 2. 销售批次管理
- 每个批次可定义：
  - 销售周期（开始时间、结束时间）
  - 交易对和兑换比率
  - 总销售限额
  - 用户单次购买限额

### 3. 兑换机制
- 用户购买时，合约接收支付资产并转出治理代币
- 支持直接铸造代币给购买用户
- 实时跟踪已售出数量

### 4. 限额控制
- ICO 合约销售治理资产的总限额
- 用户单次购买限额控制
- 防止超额销售的安全机制

## 技术实现

### 组件结构
```
icoPlugin/
├── __tests__/                 # 测试文件
│   └── icoUtils.test.ts       # 工具函数测试
├── components/
│   ├── IcoBatchList.tsx        # 销售批次列表展示
│   └── TokenPurchaseForm.tsx   # 代币购买表单
├── constants/
│   ├── icoConstants.ts         # 插件常量定义
│   └── icoPluginDialogsDefinitions.ts # 对话框定义
├── styles/
│   └── icoPlugin.css           # 插件样式
├── types/
│   └── icoTypes.ts             # TypeScript 类型定义
├── utils/
│   └── icoUtils.ts             # 工具函数
├── pages/
│   ├── IcoPage.tsx             # 用户购买页面
│   └── IcoAdminPage.tsx        # DAO 管理页面
├── INTEGRATION.md              # 集成指南
├── README.md                   # 插件说明
└── index.ts                    # 插件入口文件
```

### 主要类型定义

```typescript
interface IcoToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

interface TradingPair {
  id: string;
  inputToken: IcoToken;   // 用户支付的资产
  outputToken: IcoToken;  // DAO 治理代币
  exchangeRate: number;   // 兑换比率
}

interface SalesBatch {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  tradingPair: TradingPair;
  totalLimit: number;     // 总限额
  userLimit: number;      // 用户单次限额
  soldAmount: number;     // 已售出数量
  isActive: boolean;
}
```

## 使用说明

### 对于 DAO 管理员
1. 通过管理页面创建销售批次
2. 设置交易对和兑换比率
3. 定义销售周期和限额
4. 激活销售批次

### 对于用户
1. 浏览可用的销售批次
2. 选择合适的批次进行购买
3. 输入购买数量并确认交易
4. 完成支付后获得治理代币

## 测试

运行测试：
```bash
npm test src/plugins/icoPlugin
```

测试覆盖率包括：
- 工具函数验证
- 业务逻辑验证
- 边界条件测试

## 工具函数文档

有关详细信息，请参阅 [UTILS.md](file:///Users/aos/projects/cddao/aragon/aragonapp/src/plugins/icoPlugin/UTILS.md) 文件，其中包含所有工具函数的详细说明和使用示例。

## 安全特性
- 时间控制：确保销售只在规定时间内进行
- 限额控制：防止超额销售和单用户过度购买
- 状态验证：确保所有交易都经过有效性检查

## 集成指南

请参考 [INTEGRATION.md](file:///Users/aos/projects/cddao/aragon/aragonapp/src/plugins/icoPlugin/INTEGRATION.md) 文件了解如何将此插件集成到主应用中。