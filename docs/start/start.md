# 快速上手

## 环境

环境说明：

::: warning 温馨提示

以下，除了`NodeJs`，其他均为可选项，根据实际情况进行安装。
:::

### NodeJs

[NodeJs官网][NodeJs]

`Karin`基于`NodeJs`开发，推荐使用官方稳定长期支持的`LTS`版本`v20+`。

- 目前最低要求支持版本为`v18+`。
- `Karin`本身并未使用较新的`NodeJs`特性，理论来说支持16+版本。
- `Karin`大部分插件开发者的开发环境均在`v20+`版本，推荐使用`v20+`版本。
- 如果无需使用相关插件或功能，可自行选择是否安装`NodeJs`的版本。

### Redis

[redis官网](https://redis.io/)

- 对于`redis`，如果你不使用到相关的插件和功能，可以选择跳过这里。
- `windows`用户推荐使用[redis-windows][redis-windows]，非官方版本，请注意查看仓库说明。
- 如果无需使用相关插件或功能，可自行选择是否安装`redis`。

### Git

[git官网](https://git-scm.com/)

- `git`是一个分布式版本控制软件，~~`Karin`的所有文件默认均使用`git`进行管理、安装、更新。  ~~
- `windows`用户如下载缓慢，可使用[腾讯软件管家][腾讯软件管家]进行加速下载。
- 还是一样，`git`也是一个可选项，所有插件包括`Karin`本身都可以直接下载压缩包进行安装。

- 目前`Karin`正在向纯`npm`包管理迁移，插件还在使用`git`，请继续安装。

## 部署karin

### 安装`pnpm`

::: code-group

```bash [官方源]
npm install pnpm -g
```

```bash [国内源]
npm --registry=https://registry.npmmirror.com install pnpm -g
```

:::

### 更换npm源

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

### 安装

先新建一个空白文件夹，以下命令在文件夹里面执行。

```bash
pnpm i node-karin && npx init && node .
```

## 安装渲染器

- [karin-puppeteer](./render.md)

[NodeJs]: https://nodejs.org/en
[腾讯软件管家]: https://sw.pcmgr.qq.com/1e05804bd17b358a8c88284df8331fcd/65fcde89/spcmgr/download/Git-2.44.0-64-bit.exe
[redis-windows]: https://github.com/redis-windows/redis-windows
