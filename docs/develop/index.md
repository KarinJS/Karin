# 编写插件

## 目录

[普通插件编写](./plugin.md)  
[插件包编写](./plugins.md)

---

- [编写插件](#编写插件)
  - [目录](#目录)
  - [命名规范](#命名规范)
    - [温馨提示](#温馨提示)
  - [插件包目录参考结构](#插件包目录参考结构)
  - [#karin](#karin)

> 推荐使用 VSCode 进行开发  
> 推荐安装 `pnpm` 进行包管理  
> 推荐安装 `ESLint` 扩展插件进行语法格式检查`(需安装开发依赖，pnpm install)`

## 命名规范

- 单个js插件：请使用英文进行命名，方便开发者跟踪日志。  
- 插件包：要求以 `kritor-plugin-` 开头，后面跟上插件名，如 `kritor-plugin-hello-world`。  
- 可在仓库标签添加 `karin` 、 `karin-plugin` 等标签，方便用户搜索。
- `plugins`目录只识别以 `kritor-plugin-` 开头的文件夹

### 温馨提示

- 只有附带 `index.js` 文件在插件包根目录，才会被视为插件包
- 如不存在 `apps` 目录，则只会加载 `index.js` 文件
- 如存在 `apps` 目录，则会加载 `apps` 目录下所有的 `js` 文件、根目录的`index.js`。

## 插件包目录参考结构

```md
kritor-plugin-hello-world
├── apps
│   ├── app1.js
│   └── app2.js
├── lib
├── model
├── README.md
├── index.js
└── package.json

```

## #karin

在模板仓库下，有这么一段代码

```js
import { plugin, segment } from '#Karin'
```

`#Karin` 是一个别名，指向 `./lib/index.js` 文件。  
此文件为入口文件，开发者无需像以下这样引入模块：

```js
import segment from './lib/bot/segment.js'
import plugin from './lib/plugins/plugin.js'
```

详情请查看 [开发工具](../utils/index.md) 文档
