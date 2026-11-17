# safe4-blockchain-explorer 开发指南

本仓库是 SafeScan Web 前端，通过后端 HTTP API 和原生 WebSocket 展示区块、交易、地址、资产、节点和统计，提供合约验证入口。

## 技术栈与目录

- 使用 TypeScript/TSX、React 18、React Router 6、Ant Design 4、Redux Toolkit 1.9、ethers 5 和 Create React App（`react-scripts` 5.0.1）。依赖声明和锁定版本分别见 `package.json` 与 `yarn.lock`。
- `src/App.tsx` 定义 BrowserRouter 路由。`src/pages/` 按业务组织页面，`src/components/` 和 `src/locales/` 提供复用组件和文案。
- `src/services/` 管理 HTTP 请求与响应类型。`src/pages/Init.tsx` 接收 WebSocket 快照并更新 `src/state/`。`src/abi/` 与 `src/utils/decode/` 支持交易和事件解码。

## 构建与开发

- `npm start` 启动开发服务器，`npm run build` 生成 `build/`，`npm test` 运行 CRA 的 Jest 测试。使用 React Testing Library 验证页面行为，测试中的 HTTP 和 WebSocket 使用模拟数据。
- 遵循 TypeScript 严格模式、CRA ESLint 及相邻代码风格。沿用函数组件、Hooks 和按业务划分的服务函数。修改展示逻辑时保留金额精度与交易确认状态的语义。

## 跨仓库与 Git

- 开发前主动读取上一级的 [工作空间指令](../AGENTS.md) 和 [统一架构文档](../ARCHITECTURE.md)。跨项目开发必须核对提供方和调用方的实际代码。
- 修改公共 API、协议或跨项目数据结构前，先分析请求、响应、WebSocket 数据及钱包使用的浏览器链接会受到的影响。公共契约变更须经用户明确批准。
- 在本仓库内执行 Git 操作，保留已有改动。按任务范围修改，保留各仓库独立的 Git 历史。
