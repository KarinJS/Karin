// 循环依赖模块 B
// 导入模块 A，而模块 A 也会导入模块 B

import { functionA } from './circular-a.mjs'

console.log('模块 B 正在加载...')

export const functionB = () => {
  console.log('Function B is called')
  return 'B'
}

export const callA = () => {
  console.log('B 调用 A')
  return functionA()
}

console.log('模块 B 加载完成')
