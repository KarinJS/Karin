# 快速上手

---

## 环境

> 支持 Windows、Linux、MacOS、Docker 等环境  
> 推荐安装的没有强制性需求，可根据个人需求进行安装  
> karin开发的场景，默认您拥有以下全部环境，若有特殊需求，请自行安装

| -                | 安装     | 说明                                                                           |
| ---------------- | -------- | ------------------------------------------------------------------------------ |
| [NodeJs][NodeJs] | √        | 推荐版本18+                                                                    |
| [git][git]       | 推荐安装 | 分布式版本控制软件，国内用户推荐使用 [腾讯软件管家][腾讯软件管家] 进行加速下载 |
| [redis][redis]   | 推荐安装 | 一个高性能的内存数据库，windows用户推荐使用[redis-windows][redis-windows]      |

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

## 安装适配器

> 适配器的作用就是在不同的聊天平台之间建立桥梁，使karin可以与不同平台的用户进行交互  

- [安装适配器](./adapter.md)

## 安装渲染器

> 渲染器在karin的定义可能它更是一个单纯的截图工具  
> 默认提供了`puppeteer`，`puppeteer`打开html -> 渲染 -> 截图 -> 返回图片base64编码  
> 当然，你也可以自行注册渲染器，实现自定义截图逻辑

- [安装渲染器](../Renderer/Renderer.md)

[NodeJs]: https://nodejs.org/en
[git]: https://git-scm.com/
[腾讯软件管家]: https://sw.pcmgr.qq.com/1e05804bd17b358a8c88284df8331fcd/65fcde89/spcmgr/download/Git-2.44.0-64-bit.exe
[redis]: https://github.com/redis-windows/redis-windows/releases
[redis-windows]: https://github.com/redis-windows/redis-windows