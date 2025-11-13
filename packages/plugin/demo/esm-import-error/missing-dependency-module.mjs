// 这个模块尝试导入不存在的依赖
// 用于演示缺失依赖的错误

// 尝试导入不存在的 npm 包
import { someFunction } from 'non-existent-package-12345'
import axios from 'axios'  // 假设项目中没有安装 axios
import lodash from 'lodash'  // 假设项目中没有安装 lodash

export const testFunction = () => {
  console.log('This module has missing dependencies')
  return someFunction()
}

export default {
  testFunction,
}
