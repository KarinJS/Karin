## #karin

`./lib/index.js`

```js
import Bot from './bot/bot.js'
import App from './plugins/app.js'
import Cfg from './config/config.js'
import logger from './config/log.js'
import redis from './config/redis.js'
import segment from './bot/segment.js'
import common from './common/common.js'
import plugin from './plugins/plugin.js'
import Renderer from './Renderer/Renderer.js'
import { kritor } from './adapter/kritor/protos/compiled.js'

export { App, Bot, Cfg, common, logger, plugin, redis, segment, Renderer, kritor }

```

### 简介

可以看到，`#Karin` 是一个别名，指向 `./lib/index.js` 文件。

此文件为入口文件，开发者无需像以下这样引入模块：

```js
import segment from './lib/bot/segment.js'
import plugin from './lib/plugins/plugin.js'
```

### 使用

- `APP`
    ```js
    import { App } from '#Karin'
    // ...
    ```
- `Bot`
    ```js
    import { Bot } from '#Karin'
    // ...
    ```
- `Cfg`
    ```js
    import { Cfg } from '#Karin'
    // ...
    ```
- `common`
    ```js
    import { common } from '#Karin'

    /** 休眠函数 延迟5秒 */
    await common.sleep(5 * 1000)

    /** 下载文件 参数1为下载地址，参数2为保存到本地的路径 */
    await common.downFile('https://example.com/1.jpg', './temp/test/1.jpg')

    /** 递归创建文件夹 */
    common.mkdir('./temp/test')

    /** 快速构建淡紫色的bot前缀日志 */
    common.logger('qq', '这是一条来自QQ的消息')
    // 输出：[Bot:qq] 这是一条来自QQ的消息

    /** 获取绝对路径，支持file://前缀 */
    common.absPath('file://./temp/test')
    // 输出：/home/karin/temp/test

    /** 将文件转换为不带前缀的base64字符串 */
    await common.base64('./temp/test/1.jpg')
    // 输出：'/9j/4AAQSkZJRgABAQEAYABgAADg...'

    /** 将数据流对象转换为Buffer对象 */
    const Buffer = await common.stream(fs.createReadStream('./temp/test/1.jpg'))
    // 输出：Buffer

    /** 将文件转换为Buffer对象 支持file:// base64:// 可读流等... */
    const buffer = await common.buffer(buffer)
    // 输出 buffer

    ```
- `logger`
    ```js
    import { logger } from '#Karin'

    /** 打印trace日志 */
    logger.trace('这是一条trace日志')
    /** 打印debug日志 */
    logger.debug('这是一条debug日志')
    /** 打印info日志 */
    logger.info('这是一条info日志')
    /** 打印warn日志 */
    logger.warn('这是一条warn日志')
    /** 打印mark日志 */
    logger.mark('这是一条mark日志')
    /** 打印error日志 */
    logger.error('这是一条error日志')
    /** 打印fatal日志 */
    logger.fatal('这是一条fatal日志')

    // 其中 logger还提供了打印不同颜色日志的方法

    /** 打印红色日志 */
    logger.info(logger.red('这是一条红色的info日志'))
    /** 打印绿色日志 */
    logger.info(logger.green('这是一条绿色的info日志'))
    /** 打印黄色日志 */
    logger.info(logger.yellow('这是一条黄色的info日志'))
    /** 打印蓝色日志 */
    logger.info(logger.blue('这是一条蓝色的info日志'))
    /** 打印品红色日志 */
    logger.info(logger.magenta('这是一条品红色的info日志'))
    /** 打印青色日志 */
    logger.info(logger.cyan('这是一条青色的info日志'))
    /** 打印白色日志 */
    logger.info(logger.white('这是一条白色的info日志'))
    /** 打印灰色日志 */
    logger.info(logger.chalk.gray('这是一条灰色的info日志'))
    /** 打印淡紫色日志 */
    logger.info(logger.violet('这是一条淡紫色的info日志'))

    // 当以上方法无法满足你的需求时，你可以使用 chalk 库来自定义颜色
    logger.info(logger.chalk.hex('#FF0000')('这是一条自定义颜色的info日志'))

    ```
- `plugin`
    ```js
    import { plugin } from '#Karin'
    // ...
    ```
- `redis`
    ```js
    import { redis } from '#Karin'

    /** 存储一个键值对 */
    await redis.set('key', 'value')

    /** 存储一个键值对 60秒后过期 */
    await redis.set('key', 'value', { EX: 60 })

    /** 获取指定键的值 */
    const value = await redis.get('key')
    console.log(value)

    /** 删除指定键 */
    await redis.del('key')

    /** 获取所有键 慎用... 返回数组 */
    const all = await redis.keys('*')
    console.log(all)

    /** 模糊获取以k开头的所有键列表 返回数组 */
    const keys = await redis.keys('k*')
    /** 打印所有键的值 */
    for (const key of keys) {
        const value = await redis.get(key)
        console.log(value)
    }
    ```
- `segment`
    ```js
    import { segment } from '#Karin'
    // ...
    ```
- `Renderer`
    ```js
    import { Renderer } from '#Karin'
    // ...
    ```
- `kritor`
    ```js
    import { kritor } from '#Karin'
    // 内部方法，若无特殊需求，不建议使用
    ```
