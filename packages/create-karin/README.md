# create-karin

[![npm version](https://badge.fury.io/js/create-karin.svg?icon=si%3Anpm&icon_color=%23ff0000)](https://badge.fury.io/js/create-karin)

`create-karin` 是一个命令行脚手架工具，用于快速创建 Karin 项目和 Karin插件开发模板。

## 功能

- 快速生成 Karin 项目骨架。
- 支持创建 TypeScript 和 JavaScript 版本的 Karin插件开发模板。
- 引导用户完成项目初始化配置。

## 先决条件

- Node.js >= 18.x
- pnpm (推荐使用 pnpm 进行项目创建和管理)

## 快速开始

推荐使用 `pnpm` 来创建您的 Karin 项目：

```bash
pnpm create karin
```

该命令会引导您完成项目的创建过程，包括选择项目类型（Karin 生产环境或 Karin 插件开发模板）、输入项目名称、配置镜像源、设置 HTTP 和 WebSocket 服务的鉴权密钥，以及选择 `node-karin` 的版本。

### 创建 Karin 生产环境

如果您选择创建标准的 Karin 项目，`create-karin` 将会执行以下操作：

1.  创建项目目录。
2.  执行 `pnpm init` 初始化 `package.json`。
3.  使用 `pnpm install node-karin@<version>` 安装指定版本的 `node-karin`。
4.  执行 `npx karin init` 进行项目初始化。
5.  根据您的输入更新 `.env` 文件中的 `HTTP_AUTH_KEY` 和 `WS_SERVER_AUTH_KEY`。

项目创建成功后，您可以按照提示进入项目目录并启动应用：

```bash
cd <your-project-name>
pnpm app
```

### 创建 Karin 插件开发模板

如果您选择创建 Karin插件开发模板，可以选择 TypeScript 或 JavaScript 版本。`create-karin` 将会执行以下操作：

1.  创建项目目录。
2.  从内置模板 (`karin-plugin-ts` 或 `karin-plugin-js`) 复制文件。
3.  更新插件项目的 `package.json` 中的 `name` 字段。
4.  使用 `pnpm install -D node-karin@<version>` 安装指定版本的 `node-karin` 作为开发依赖。
5.  执行 `npx karin init` 进行项目初始化。
6.  根据您的输入更新 `.env` 文件中的 `HTTP_AUTH_KEY` 和 `WS_SERVER_AUTH_KEY`。

插件项目创建成功后，您可以按照提示进入项目目录并开始开发：

```bash
cd <your-plugin-name>
pnpm dev
```

## 命令行参数与选项

`create-karin` 工具通过交互式提问来收集必要的项目信息。主要包括：

- **项目名称 (Project name)**: 您新项目的名称。
- **项目类型 (Select a type)**: 选择创建 "Karin Project" (标准 Karin 项目) 还是 "Karin Plugin" (Karin插件开发模板)。
  - 如果选择 "Karin Plugin"，会进一步询问插件类型 "karin-plugin-ts" 或 "karin-plugin-js"。
- **Karin 版本 (Input karin version)**: 指定 `node-karin` 的版本，默认为 `latest`。
- **HTTP 服务认证密钥 (Input http auth key)**: 设置 HTTP 服务的 `HTTP_AUTH_KEY`。
- **WebSocket 服务认证密钥 (Input ws auth key)**: 设置 WebSocket 服务的 `WS_SERVER_AUTH_KEY`。
- **镜像源 (Select a registry)**: 选择下载依赖时使用的 npm 镜像源。

## 详细说明

`create-karin` 工具旨在简化 Karin 相关项目的启动流程。它封装了项目目录的创建、依赖的安装、基础配置的生成等步骤。

### 项目结构 (插件模板)

插件模板 (`karin-plugin-ts` 和 `karin-plugin-js`) 提供了一个基础的插件开发结构，您可以基于此快速开始您的插件开发。

### 配置文件

- `.env`: 用于存储环境变量，如 `HTTP_AUTH_KEY` 和 `WS_SERVER_AUTH_KEY`。`create-karin` 会在初始化时帮助您配置这些值。
