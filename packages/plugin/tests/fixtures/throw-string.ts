/**
 * 测试模块 - 抛出非Error对象的模块
 * 用于测试 loader.ts 第59行的分支：error instanceof Error ? error : new Error(String(error))
 */

// 这个模块在被导入时会抛出一个字符串而不是 Error 对象
throw 'This is a string error, not an Error object'
