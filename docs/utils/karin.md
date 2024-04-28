# 概述

`#Karin`是`./lib/index.js`文件的别名，这是一个集中导出多个模块的入口文件。  
通过使用别名，开发者可以更简洁地引入所需的模块，无需指定完整的路径。

```js
import segment from './lib/bot/segment.js'
import plugin from './lib/plugins/plugin.js'

// 以上的导入麻烦且冗长，在使用别名后可以简化为
import { segment, plugin } from '#Karin'
```

## 使用

::: tip
可能会更新不及时，有一定阅读能力的可以查看 [lib/index.js](https://github.com/KarinJS/Karin/blob/main/lib/index.js)
:::

- ## `kritor`

   内部方法，若无特殊需求，不建议使用

- ## `APP`

    ```js
    import { App } from '#Karin'
    // ...
    ```

- ## `Bot`

    ```js
    import { Bot } from '#Karin'
    // ...
    ```

- ## `Cfg`

    ```js
    import { Cfg } from '#Karin'
    // ...
    ```

- ## `plugin`

    ```js
    import { plugin } from '#Karin'
    // ...
    ```
