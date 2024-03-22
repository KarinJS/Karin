# 快速上手

---

### 环境

> 支持 Windows、Linux、MacOS、Docker 等环境  
> 推荐安装的没有强制性需求，可根据个人需求进行安装

| -                | 安装     | 说明                                                                           |
| ---------------- | -------- | ------------------------------------------------------------------------------ |
| [NodeJs][NodeJs] | √        | 推荐版本16以上                                                                 |
| [git][git]       | 推荐安装 | 分布式版本控制软件，国内用户推荐使用 [腾讯软件管家][腾讯软件管家] 进行加速下载 |
| [redis][redis]   | 推荐安装 | 用于存储数据，大多数插件都用到，推荐安装                                       |

### 安装

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

```sh
git clone --depth=1 https://github.com/KarinJS/Karin.git
```

3. 安装依赖

```sh
cd Karin
```

::: code-group

```sh [安装生产依赖]
pnpm install -P
```

```sh [安装全部依赖]
pnpm install
```
:::

> 你可以选择其中任何一种方式进行依赖安装。

4. 启动项目

```sh
node index
```


[NodeJs]: https://nodejs.org/en
[git]: https://git-scm.com/
[腾讯软件管家]: https://sw.pcmgr.qq.com/1e05804bd17b358a8c88284df8331fcd/65fcde89/spcmgr/download/Git-2.44.0-64-bit.exe
[redis]: https://github.com/redis-windows/redis-windows/releases
