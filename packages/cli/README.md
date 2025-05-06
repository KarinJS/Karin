# @karinjs/cli

[![npm version](https://badge.fury.io/js/@karinjs%2Fcli.svg?icon=si%3Anpm&icon_color=%23ff0000)](https://badge.fury.io/js/@karinjs%2Fcli)

Karin CLI 工具。

## 描述

`@karinjs/cli` 是 Karin 的命令行界面工具。它提供了一系列命令来帮助您管理 Karin 项目。此 CLI 工具旨在 Karin 项目的根目录中运行。

## 先决条件

- Node.js >= 18
- Karin 项目的根目录环境。

## 安装

### 创建 Karin 项目 (推荐方式)

创建新的 Karin 项目推荐使用官方的脚手架工具

```bash
pnpm create karin
```

该命令会引导您完成项目的初始化，并自动安装包括 `node-karin` 在内的所有必要依赖。通过这种方式创建的项目，您可以直接在项目根目录下使用 `npx karin <command>` 或 `npx ki <command>` 来执行 CLI 命令

### 全局安装 `@karinjs/cli` (可选)

如果您希望在系统的任何 Karin 项目根目录下直接使用 `karin` 或 `ki` 命令，而无需 `npx` 前缀，可以选择全局安装 `@karinjs/cli`

**推荐使用 npm 进行全局安装：**

```bash
npm install -g @karinjs/cli
```

全局安装后，您可以在任何 Karin 项目的根目录下直接运行 `karin` 或 `ki` 命令。

## 使用

**重要提示：** 无论使用何种方式，CLI 命令都必须在 Karin 项目的根目录下执行。

### 通过 `npx` (项目内推荐)

如果您的项目是通过 `pnpm create karin` 创建的，或者项目中已安装 `node-karin`，可以在项目根目录下使用 `npx` 调用 CLI：

```bash
npx karin <command> [options]
```

或者使用简写：

```bash
npx ki <command> [options]
```

### 全局安装后直接调用

如果您已全局安装 `@karinjs/cli`，可以在项目根目录下直接运行：

```bash
karin <command> [options]
```

或者使用简写：

```bash
ki <command> [options]
```

### 通过 npm scripts

如果 `karin` 或 `ki` 命令已在您的项目 `package.json` 的 `scripts` 中定义，您可以直接使用 `npm run <script-name>` 或 `yarn <script-name>` 或 `pnpm <script-name>`。

---

`@karinjs/cli` (无论是通过 `npx` 调用的 `node-karin` 内置版本，还是全局安装的 `@karinjs/cli` 包) 会自动检测并执行相应的 CLI 逻辑。

**核心逻辑：**

- 检查当前目录是否为有效的 Karin package 目录。
- 确保能够访问到 `node-karin` 包中提供的核心 CLI 实现 (通常在项目的 `node_modules/node-karin/dist/cli/` 中)。
- 执行相应的命令。

如果环境不满足要求 (例如不在 Karin 项目根目录)，CLI 将会输出错误信息并退出。
