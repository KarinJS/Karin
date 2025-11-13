// 这是一个语法错误的模块文件
// 故意包含语法错误来演示动态导入时的错误处理

export const validFunction = () => {
  return 'This is valid'
}

// 语法错误：缺少右括号
export const syntaxErrorFunction = () => {
  console.log('This will cause syntax error'）
  // 缺少 }

export const anotherFunction = 'also broken syntax here')
