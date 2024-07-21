# 概述

通过使用别名，开发者可以更简洁地引入所需的模块，无需指定完整的路径。

```js
// 不建议这么做！
import segment from 'node_modules/node-karin/lib/bot/segment.js'
import plugin from 'node_modules/node-karin/lib/plugins/plugin.js'

// 以上的导入麻烦且冗长，在使用别名后可以简化为
import { segment, Plugin } from 'node-karin'
```

## 使用

::: tip
文档可能会更新不及时，有一定阅读能力的可以查看 [**src/index.ts**](https://github.com/KarinJS/Karin/blob/dev/src/index.ts)
:::

- ## `kritor`

   内部方法，若无特殊需求，不建议使用

- ## `APP`

    ```js
    import { App } from 'node-karin'
    // ...
    ```

- ## `Bot`

    ```js
    import { Bot } from 'node-karin'
    // ...
    ```

- ## `Cfg`

    ```js
    import { Cfg } from 'node-karin'
    // ...
    ```

- ## `plugin`

    ```js
    import { Plugin } from 'node-karin'
    // ...
    ```
