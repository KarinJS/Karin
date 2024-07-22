# 快速上手

## 环境

环境说明：

::: warning 温馨提示

以下，除了`Node.js`，其他均为可选项，根据实际情况进行安装。
:::

### NodeJs <Badge type="danger" text="必装 " /> 

[Node.js官网][Node.js]

`Karin`基于`Node.js`开发，推荐使用官方稳定长期支持的`LTS`版本`v20+`。

- 目前最低要求支持版本为`v18+`。
- `Karin`本身并未使用较新的`Node.js`特性，理论来说支持16+版本。
- `Karin`大部分插件开发者的开发环境均在`v20+`版本，推荐使用`v20+`版本。
- 如果无需使用相关插件或功能，可自行选择是否安装`Node.js`的版本。

### Git <Badge type="danger" text="必装 " /> 

[git官网](https://git-scm.com/)

- `windows`用户如下载缓慢，可使用[腾讯软件管家][腾讯软件管家]进行加速下载。
- 还是一样，`git`也是一个可选项，所有插件包括`Karin`本身都可以直接下载压缩包进行安装。

- 目前`Karin`正在向纯`npm`包管理迁移，插件还在使用`git`，请继续安装。

## 部署karin

> [!TIP] 提示
> 如果你无法访问`npm`官网，请先看最下方的更换 [**更换npm源**](#更换npm源)

### 安装`pnpm`

::: code-group

```bash [官方源]
npm install pnpm -g
```

```bash [国内源]
npm --registry=https://registry.npmmirror.com install pnpm -g
```

:::

### 安装

先新建一个空白文件夹，以下命令在文件夹里面执行，执行完成不出意外已经启动完毕了~

```bash
pnpm i node-karin && npx init && npx karin .
```

### 基本指令

> [!IMPORTANT] 务必注意
> 文档可能更新不及时，可`npx karin`查看全部指令

::: code-group

```bash [前台启动]
npx karin .
```

```bash [前台启动]
npx karin start
```

```bash [后台启动]
npx karin pm2
```

```bash [后台停止]
npx karin stop
```

```bash [重启pm2]
npx karin rs
```

```bash [查看pm2日志]
npx karin log
```

:::

#### 后台启动

### 安装渲染器

- [karin-puppeteer](./render.md)

## 其他

### 更换npm源

<details>
  <summary>点我展开</summary>

::: warning 注意
如果你是中国大陆服务器，并且无法访问`npm`官方源，这里请务必更换为镜像源。
:::

- 查询当前镜像源

```bash
npm config get registry
```

- 更换镜像源

::: code-group

```bash [淘宝源]
npm config set registry https://registry.npmmirror.com
```

```bash [腾讯源]
# 在无法访问淘宝源的情况下，可以尝试使用腾讯源
npm config set registry https://mirrors.cloud.tencent.com/npm
```

```bash [官方源]
# 如果你需要恢复为官方源
npm config set registry https://registry.npmjs.org
```

:::

</details>


[Node.js]: https://nodejs.org/en
[腾讯软件管家]: https://sw.pcmgr.qq.com/1e05804bd17b358a8c88284df8331fcd/65fcde89/spcmgr/download/Git-2.44.0-64-bit.exe
[redis-windows]: https://github.com/redis-windows/redis-windows
