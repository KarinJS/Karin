// 循环依赖模块 A
// 导入模块 B，而模块 B 也会导入模块 A

import { functionB } from './circular-b.mjs'

console.log('模块 A 正在加载...')

export const functionA = () => {
  console.log('Function A is called')
  return 'A'
}

export const callB = () => {
  console.log('A 调用 B')
  return functionB()
}

console.log('模块 A 加载完成')
