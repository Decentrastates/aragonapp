# ICO Plugin Integration Guide

## 插件概述

ICO 插件为 DAO 提供了一个完整的首次代币发行（ICO）管理系统，允许 DAO 管理交易对、兑换比率和销售批次。

## 集成步骤

### 1. 插件注册

ICO 插件已经自动注册到主插件系统中。在 [src/plugins/index.ts](file:///Users/aos/projects/cddao/aragon/aragonapp/src/plugins/index.ts) 文件中，您可以看到：

```typescript
import { initialiseIcoPlugin } from './icoPlugin';

export const initialisePlugins = () => {
    // ... 其他插件
    initialiseIcoPlugin();
};
```

### 2. 路由配置

要访问 ICO 插件页面，您需要在应用路由中添加相应的路由配置。通常在 `src/app` 目录下配置路由。

### 3. 权限配置

ICO 插件包含两个主要页面：
- 用户购买页面 (`IcoPage`)
- DAO 管理页面 (`IcoAdminPage`)

确保为不同用户角色正确配置访问权限。

## 组件说明

### IcoPage (用户购买页面)
- 路径: `/ico`
- 功能: 展示可用的 ICO 销售批次，允许用户购买代币

### IcoAdminPage (管理页面)
- 路径: `/admin/ico`
- 功能: 允许 DAO 管理员创建和管理 ICO 销售批次

## API 集成

当前版本使用模拟数据。在生产环境中，您需要将以下组件替换为实际的区块链交互：

1. [src/plugins/icoPlugin/pages/IcoPage.tsx](file:///Users/aos/projects/cddao/aragon/aragonapp/src/plugins/icoPlugin/pages/IcoPage.tsx) 中的 `handlePurchase` 函数
2. 数据获取逻辑需要连接到实际的智能合约

## 样式集成

ICO 插件的样式定义在 [src/plugins/icoPlugin/styles/icoPlugin.css](file:///Users/aos/projects/cddao/aragon/aragonapp/src/plugins/icoPlugin/styles/icoPlugin.css) 文件中。确保在您的应用中正确导入此样式文件。

## 自定义配置

您可以通过修改 [src/plugins/icoPlugin/constants/icoConstants.ts](file:///Users/aos/projects/cddao/aragon/aragonapp/src/plugins/icoPlugin/constants/icoConstants.ts) 文件来自定义插件的默认行为和常量。

## 扩展功能

### 添加新的代币类型
在 [src/plugins/icoPlugin/types/icoTypes.ts](file:///Users/aos/projects/cddao/aragon/aragonapp/src/plugins/icoPlugin/types/icoTypes.ts) 中定义的 `IcoToken` 接口可以轻松扩展以支持新的代币属性。

### 添加验证规则
在 [src/plugins/icoPlugin/utils/icoUtils.ts](file:///Users/aos/projects/cddao/aragon/aragonapp/src/plugins/icoPlugin/utils/icoUtils.ts) 中可以添加更多的验证规则来确保交易安全。

## 故障排除

### 常见问题

1. **样式未正确加载**
   - 确保已正确导入 CSS 文件
   - 检查是否有样式冲突

2. **组件未正确渲染**
   - 确保插件已正确初始化
   - 检查控制台错误信息

### 支持

如需进一步帮助，请参考插件的 [README.md](file:///Users/aos/projects/cddao/aragon/aragonapp/src/plugins/icoPlugin/README.md) 文件或联系开发团队。