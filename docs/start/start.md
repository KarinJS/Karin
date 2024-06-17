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

- `git`是一个分布式版本控制软件，`Karin`的所有文件默认均使用`git`进行管理、安装、更新。  
- `windows`用户如下载缓慢，可使用[腾讯软件管家][腾讯软件管家]进行加速下载。
- 还是一样，`git`也是一个可选项，所有插件包括`Karin`本身都可以直接下载压缩包进行安装。

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

### 克隆项目

::: warning 温馨提示  
`KarinJS`组织的所有项目，均可通过将域名中的`github`更换为`gitee`进行加速下载~
:::

::: code-group

```bash [Github]
git clone --depth=1 https://github.com/KarinJS/Karin.git
```

```bash [Gitee]
git clone --depth=1 https://gitee.com/KarinJS/Karin.git
```

:::

### 安装依赖

::: warning 温馨提示
开发依赖较为臃肿庞大，普通用户请安装生产依赖即可
:::

```bash
cd Karin
```

::: code-group

```bash [安装生产依赖]
pnpm install -P
```

```bash [安装开发依赖]
pnpm install
```

:::

### 启动项目

::: warning 温馨提示
开发模式支持`plugins/apps`文件夹热更新、插件包的`index.js`热更新  
正常启动下，仅支持热更新非插件包例如自带的`karin-plugin-example`
:::

::: code-group

```bash [正常启动]
node .
```

```bash [开发模式]
node . --dev
```

:::

## 安装渲染器

- [karin-puppeteer](./render.md)

[NodeJs]: https://nodejs.org/en
[腾讯软件管家]: https://sw.pcmgr.qq.com/1e05804bd17b358a8c88284df8331fcd/65fcde89/spcmgr/download/Git-2.44.0-64-bit.exe
[redis-windows]: https://github.com/redis-windows/redis-windows
