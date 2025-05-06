# node-karin-cli (Karin CLI Core Logic)

`node-karin cli` - Karin 的核心命令行工具实现。

## 描述

本包 (`node-karin-cli`) 包含了 Karin 命令行界面 (CLI) 的核心执行逻辑。它负责处理所有实际的命令操作，如项目初始化、启动、更新、依赖管理等。

通常情况下，开发者不会直接安装或调用此包。而是通过以下两种方式间接使用：

1.  **[`@karinjs/cli`](https://www.npmjs.com/package/@karinjs/cli) 包**: 这是一个面向用户的全局 CLI 工具，它会查找并执行本项目 (或 `node-karin` 包中集成的类似 CLI 核心) 的功能。
2.  **[`node-karin`](https://www.npmjs.com/package/node-karin) 包**: Karin 的本体，它内部集成了 CLI 功能，允许通过 `npx karin` 或 `npx ki` 在项目本地执行命令。

此包是 [`@karinjs/cli`](https://www.npmjs.com/package/@karinjs/cli) 和 [`node-karin`](https://www.npmjs.com/package/node-karin) 中 CLI 功能的实际执行者。

## 安装

`node-karin-cli` 通常作为 [`node-karin`](https://www.npmjs.com/package/node-karin) 的一个内部依赖或直接集成部分进行管理。开发者一般不需要也**不应该**直接安装此包。

如果您正在开发 Karin 项目，请确保您的项目中已安装 [`node-karin`](https://www.npmjs.com/package/node-karin)。如果您希望全局使用 Karin CLI 命令，请安装 [`@karinjs/cli`](https://www.npmjs.com/package/@karinjs/cli)。

## 使用方法 (内部命令参考)

以下命令由本 CLI 核心实现提供，并通过 [`@karinjs/cli`](https://www.npmjs.com/package/@karinjs/cli) 或 [`node-karin`](https://www.npmjs.com/package/node-karin) (使用 `npx`) 暴露给用户：

- **启动项目**
  - `karin .` 或 `karin app` 或 `karin start`
    - 描述：前台启动项目。
- **PM2 相关命令 (后台运行)**
  - `karin pm2`
    - 描述：使用 PM2 后台运行项目。
  - `karin stop`
    - 描述：停止 PM2 管理的后台服务。
  - `karin rs` 或 `karin restart [-f, --force]`
    - 描述：重启 PM2 管理的后台服务。
    - `-f, --force`: 强制重启。
  - `karin log`
    - 描述：查看 PM2 管理的项目的日志。
- **项目管理**
  - `karin init [-f, --force] [-d, --dev]`
    - 描述：初始化 Node Karin 项目。
    - `-f, --force`: 强制初始化，会覆盖现有的一些配置文件。
    - `-d, --dev`: 以开发模式初始化。
  - `karin up [-f, --force] [-s, --serial]`
    - 描述：更新项目依赖和插件。
    - `-f, --force`: 强制更新 Git 插件。
    - `-s, --serial`: 串行更新（默认为并行）。
- **依赖管理 (pnpm v10.x)**
  - `karin b <action> [dependency]` 或 `karin allow-build <action> [dependency]`
    - 描述：管理 `pnpm-workspace.yaml` 中的 `onlyBuiltDependencies`。
    - `<action>`: 操作类型，可选值为 `add`, `rm`, `ls`。
    - `[dependency]`: 依赖包名称。对于 `add` 和 `rm` 操作，可以提供单个或多个以逗号分隔的依赖。
      - `add <dependency>`: 添加依赖到构建列表。
      - `rm <dependency>`: 从构建列表中移除依赖。
      - `ls`: 列出当前构建列表中的所有依赖。

## 主要脚本 (来自 package.json - 用于本包开发)

- `app`: `node dist/index.mjs` (通常用于测试生产环境构建的启动)
- `dev`: `tsx src/index.ts` (用于本包的开发，使用 tsx 实时编译和运行 TypeScript)
- `build`: `pnpm cp && tsc && vite build && tsup` (构建本包，用于发布)
