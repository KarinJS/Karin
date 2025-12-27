/**
 * 测试模块 - 导出 null 和基础类型的模块
 * 用于测试 loader.ts 第137行的分支：isRegistrable 返回 false
 */

// 这些导出应该不被视为可注册的组件
export const nullValue = null
export const undefinedValue = undefined
export const numberValue = 42
export const stringValue = 'hello'
export const boolValue = true

// 这些应该被视为可注册的
export const functionValue = () => { }
export const objectValue = { name: 'test' }
