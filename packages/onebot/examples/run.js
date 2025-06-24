/**
 * OneBot 示例运行脚本
 */
const { execSync } = require('child_process')
const readline = require('readline')

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// 示例列表
const examples = [
  { name: 'HTTP客户端示例', file: 'http-client.ts' },
  { name: 'HTTP服务器示例', file: 'http-server.ts' },
  { name: 'API调用示例', file: 'api-examples.ts' },
  { name: '消息构建示例', file: 'message-builder.ts' },
]

// 显示菜单
function showMenu () {
  console.log('\n===== OneBot 示例菜单 =====')
  examples.forEach((example, index) => {
    console.log(`${index + 1}. ${example.name}`)
  })
  console.log('0. 退出')
  console.log('========================\n')
}

// 运行示例
function runExample (index) {
  if (index < 0 || index >= examples.length) {
    console.error('无效的选择！')
    return start()
  }

  const example = examples[index]
  console.log(`\n正在运行 ${example.name}...`)
  console.log('按 Ctrl+C 终止运行\n')

  try {
    execSync(`npx tsx examples/${example.file}`, { stdio: 'inherit' })
  } catch (error) {
    // 用户可能按了Ctrl+C，不处理错误
  }

  // 运行结束后重新显示菜单
  start()
}

// 开始流程
function start () {
  showMenu()
  rl.question('请选择要运行的示例 (0-4): ', (answer) => {
    const choice = parseInt(answer.trim())

    if (choice === 0) {
      console.log('感谢使用，再见！')
      rl.close()
      return
    }

    if (isNaN(choice) || choice < 1 || choice > examples.length) {
      console.error('请输入有效的选项！')
      return start()
    }

    runExample(choice - 1)
  })
}

// 显示欢迎信息
console.log(`
#################################################
#                                               #
#             OneBot 示例程序                   #
#                                               #
#  请确保已正确配置并运行OneBot实现             #
#  示例代码需要修改为正确的参数才能正常运行     #
#                                               #
#################################################
`)

// 启动
start()

// 处理退出事件
rl.on('close', () => {
  process.exit(0)
})
