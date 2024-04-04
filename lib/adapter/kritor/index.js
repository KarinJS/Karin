import grpc from '@grpc/grpc-js' // 引入gRPC库
import { kritor } from './proto/reverse/reverse.js' // 导入编译后的 JavaScript 代码

/** 初始化 gRPC 服务器 */
function init () {
  // 创建包含服务实现方法的对象
  const reverseImplementation = {
    ReverseStream: function (call) {
      call.on('data', function (response) {
        // 处理客户端发送的数据，这里可以编写你的逻辑
        // 例如，根据客户端请求生成响应，并发送给客户端
        // const _request = new kritor.common.Request() // 使用导入的请求对象
        // 对请求进行处理，生成响应
        // const response = new kritor.common.Response(); // 使用导入的响应对象
        // 将响应发送给客户端
        // call.write(response);
      })

      call.on('end', function () {
        // 客户端发送完所有数据后的处理逻辑
        call.end() // 结束响应
      })
    }
  }

  const server = new grpc.Server()
  server.addService(kritor.reverse.ReverseService.service, reverseImplementation) // 使用导入的服务描述符对象

  server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Server bind failed:', err)
    } else {
      console.log('Server listening on port', port)
      server.start() // 启动服务器
    }
  })
}

// 初始化 gRPC 服务器
init()

// const _path = process.cwd() // 获取当前工作目录路径

// const protoOptions = {
//   keepCase: true, // 保持字段名称的大小写
//   longs: String, // 将长整型编码为字符串而不是对象
//   enums: String, // 将枚举编码为字符串而不是数字
//   defaults: true, // 在消息中包含默认值
//   oneofs: true // 将oneof字段编码为普通JS属性而不是嵌套对象
// }
// // 假设kritor客户端唯一
// export let kritorCall = null // 初始化kritor调用对象
// export let kritorEventCall = null // 初始化kritor事件调用对象
// export const waitingMap = new Map() // 创建等待映射表
// export const server = new grpc.Server() // 创建gRPC服务器实例
// const protoDir = './kritor/protos' // 设置proto文件所在目录路径
// const reverseProto = protoDir + '/reverse.proto' // 设置反向通信proto文件路径
// const packageDefinition = protoLoader.loadSync(reverseProto, protoOptions) // 加载反向通信proto文件定义
// const protoPackage = grpc.loadPackageDefinition(packageDefinition) // 加载反向通信proto包定义

// // 定义反向通信实现
// const reverseImplementation = {
//   ReverseStream: (call) => {
//     const metadata = call.metadata.getMap()
//     console.log('🚀 ~ metadata:', metadata)
//     // common.debug('Received ReverseStream metadata:', metadata) // 输出接收到的元数据
//     call.on('data', data => {
//       console.log(data)
//       //   common.debug('Received ReverseStream data:', data)
//     })
//     call.on('end', () => {
//       console.log('ReverseStream end') // 输出反向通信结束信息
//     })
//     kritorCall = call // 将call对象赋给kritorCall
//     // if (!kritorCall) {
//     //   call.write({
//     //     cmd: 'KritorService.GetCurrentAccount',
//     //     buf: '',
//     //     seq: 100
//     //   })
//     // }
//     // @ts-ignore
//     kritorEventCall.on('data', (data) => {
//       console.log(data)
//     })
//   }
// }

// // 根据命令获取protobuf定义
// export function getPbDefByCmd (cmd, type = 'rsp') {
//   if (!cmd) {
//     throw new Error('cmd is required') // 抛出错误，要求提供命令
//   }
//   let [ns, method = ''] = cmd.split('.')
//   // todo
//   const nsPkgMap = {
//     KritorService: 'core',
//     DeveloperService: 'qsign',
//     ContactService: 'contact',
//     GroupFileService: 'file',
//     FriendService: 'friend',
//     GroupService: 'group',
//     GuildService: 'guild',
//     MessageService: 'message',
//     WebService: 'web',
//     Authentication: '',
//     ReverseService: ''
//   }
//   if (type === 'rsp') {
//     method += 'Response'
//   } else {
//     method += 'Request'
//   }
//   if (method) {
//     return kritor[nsPkgMap[ns]][method] // 返回protobuf定义
//   } else {
//     return kritor[ns]() // 返回命名空间
//   }
// }

// // 异步发送请求并等待
// export const asyncSendAndWait = async (call, cmd, buf, seq, timeoutMs = 60000) => {
//   const timeoutPromise = new Promise((_, reject) => {
//     const timeoutId = setTimeout(() => {
//       clearTimeout(timeoutId) // 清除计时器
//       reject(new Error('Operation timed out')) // 超时后reject
//     }, timeoutMs)
//   })
//   const p = new Promise((resolve, reject) => {
//     waitingMap.set(seq, resolve) // 将resolve函数与seq映射存储到等待映射表中
//     call.write({
//       cmd,
//       buf,
//       seq
//     })
//   })
//   return Promise.race([p, timeoutPromise]) // 返回一个Promise，竞争p和超时Promise
// }

// server.addService(protoPackage.kritor.ReverseService.service, reverseImplementation) // 添加反向通信服务

// const eventProto = protoDir + '/event/event.proto' // 事件proto文件路径
// const eventpackageDefinition = protoLoader.loadSync(eventProto, {
//   ...protoOptions,
//   includeDirs: [protoDir] // 指定包含所有相关.proto文件的目录列表
// })

// const eventprotoPackage = grpc.loadPackageDefinition(eventpackageDefinition) // 加载事件proto包定义

// // 定义事件实现
// const eventImplementation = {
//   RegisterPassiveListener: (call) => {
//     const metadata = call.metadata.getMap()
//     // console.log("🚀 ~ metadata:", metadata)
//     // common.debug('Received RegisterPassiveListener metadata:', metadata) // 输出接收到的元数据
//     call.on('data', (data) => {
//       console.log(data)
//       //   common.debug('RegisterPassiveListener:', data)
//     })
//     call.on('end', () => {
//       // common.debug('RegisterPassiveListener end') // 输出注册被动监听结束信息
//     })
//     kritorEventCall = call // 将call对象赋给kritorEventCall
//   }
// }
// server.addService(eventprotoPackage.kritor.event.EventService.service, eventImplementation) // 添加事件服务

// /** 连接 */
// server.bindAsync('0.0.0.0:2956', grpc.ServerCredentials.createInsecure(), () => {
//   // server.start()
//   console.log('Kritor gRPC server running on port 2956')
// })
