# Karin Web UI

那我问你

## ✨ 主要特性

- **机器人管理**: 查看和管理已连接的机器人实例。
- **插件配置**: 安装、卸载、启用、禁用和配置插件。
- **状态监控**: 实时查看机器人运行状态和日志。
- **用户界面**: 基于 HeroUI 构建的现代化、响应式用户界面。
- **数据统计**: 咕咕咕 ~~~

## 🛠️ 技术栈

- **前端框架**: React
- **语言**: TypeScript
- **构建工具**: Vite
- **UI 组件库**: HeroUI
- **路由**: React Router
- **HTTP 请求**: Axios

## 🚀 开始使用

### 先决条件

确保你的开发环境中安装了以下软件：

- [Node.js](https://nodejs.org/) (最低 v18 LTS 版本)
- [pnpm](https://pnpm.io/)

### 安装

1.  克隆仓库:
    ```bash
    git clone https://github.com/KarinJS/Karin.git
    ```
2.  安装依赖:
    ```bash
    pnpm install
    ```

### 运行项目

- **开发模式**:
  启动本地开发服务器，通常带有热重载功能。

  ```bash
  pnpm dev:web
  ```

  服务将运行在 `http://localhost:xxxx` (具体端口请查看 Vite 启动日志)。

- **构建项目**:
  将项目编译并打包为生产环境的静态文件。

  ```bash
  pnpm build:web
  ```

  构建产物通常会输出到 `dist` 目录。

- **代码检查与修复**:
  使用 ESLint 检查代码规范并尝试自动修复。

  ```bash
  cd packages/web
  pnpm run lint
  ```

- **预览生产构建**:
  在本地启动一个服务器来预览生产构建的成果。
  ```bash
  cd packages/web
  pnpm run preview
  ```
