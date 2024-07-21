# common

```js
import { common } from 'node-karin'

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
