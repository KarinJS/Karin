# 快速上手

---

## 环境

> 支持 Windows、Linux、MacOS、Docker 等环境  
> 推荐安装的没有强制性需求，可根据个人需求进行安装

| -                | 安装     | 说明                                                                           |
| ---------------- | -------- | ------------------------------------------------------------------------------ |
| [NodeJs][NodeJs] | √        | 推荐版本18以上                                                                 |
| [git][git]       | 推荐安装 | 分布式版本控制软件，国内用户推荐使用 [腾讯软件管家][腾讯软件管家] 进行加速下载 |
| [redis][redis]   | 推荐安装 | 用于存储数据，大多数插件都用到，推荐安装                                       |

## 安装

> 以下命令均为默认您安装了`NodeJs`、`git`

1. 安装`pnpm`(可选)
::: code-group

```sh [官方源]
npm install pnpm -g
```

```sh [国内源]
npm --registry=https://registry.npmmirror.com install pnpm -g
```

:::

2. 使用git克隆项目

::: tip
中国大陆服务器推荐使用`Gitee`镜像源  
`Karin`官方的所有项目，均可通过将域名中的`github`更换为`gitee`进行加速下载~
:::

::: code-group

```sh [Github]
git clone --depth=1 https://github.com/KarinJS/Karin.git
```

```sh [Gitee]
git clone --depth=1 https://gitee.com/KarinJS/Karin.git
```

:::

1. 初始化项目

> 进入项目目录

```sh
cd Karin
```

2. ~~拉取子模块~~

> 可跳过，karin会自动拉取子模块

```sh
git submodule update --init --recursive
```

3. 安装依赖
::: code-group

```sh [安装生产依赖]
pnpm install -P
```

```sh [安装开发依赖]
pnpm install
```

:::

> 你可以选择其中任何一种方式进行依赖安装。

4. 启动项目

::: tip
开发模式支持`plugins/apps`文件夹热更新、插件包的`index.js`热更新  
正常启动下，仅支持热更新非插件包例如自带的`karin-plugin-example`
:::

::: code-group

```sh [正常启动]
node .
```

```sh [开发模式启动]
node . --dev
```

:::

## 渲染器

::: tip
`Karin`开放了`Renderer`接口，开发者可自行注册渲染器，实现自定义渲染器
:::

如果你不需要进行渲染`html`页面等操作，可跳过此步骤。

默认提供[karin-puppeteer][karin-puppeteer]作为渲染器，可根据需求自行安装。  
通过`WebSocketServer`进行通信，详情请查看[karin-puppeteer][karin-puppeteer]

[karin-puppeteer]: https://github.com/KarinJS/karin-puppeteer
[NodeJs]: https://nodejs.org/en
[git]: https://git-scm.com/
[腾讯软件管家]: https://sw.pcmgr.qq.com/1e05804bd17b358a8c88284df8331fcd/65fcde89/spcmgr/download/Git-2.44.0-64-bit.exe
[redis]: https://github.com/redis-windows/redis-windows/releases
