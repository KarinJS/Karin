import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { logger } from '#Karin'
// import { kritor } from './proto/reverse/reverse.js'

/**
 * 获取 proto 文件
 * @param {string} filename
 * @param {string[]} dirs
 * @returns {unknown}
 */
function getProtoGrpcType (filename) {
  filename = process.cwd() + '/lib/adapter/kritor/kritor/protos/' + filename
  const dirs = [process.cwd() + '/lib/adapter/kritor/kritor/protos']
  const definition = protoLoader.loadSync(filename, { includeDirs: dirs })
  return grpc.loadPackageDefinition(definition)
}

/** 初始化 gRPC 服务器 */
function init () {
  const authenticationServer = {
    Authenticate: (call, callback) => {
      console.log(call.request, call.metadata)
      console.log(callback)
      // server handlers implementation...
    },
    GetAuthenticationState: (call, callback) => {
      console.log(call.request, call.metadata)
      console.log(callback)
      // server handlers implementation...
    },
    AddTicket: (call, callback) => {
      console.log(call.request, call.metadata)
      console.log(callback)
      // server handlers implementation...
    },
    DeleteTicket: (call, callback) => {
      console.log(call.request, call.metadata)
      console.log(callback)
      // server handlers implementation...
    },
    GetTicket: (call, callback) => {
      console.log(call.request, call.metadata)
      console.log(callback)
      // server handlers implementation...
    },
    RegisterPassiveListener: (call, callback) => {
      call.on('data', data => {
        logger.info('收到事件:', data)
        console.log(data.message.elements)
      })
      call.on('end', () => {
        logger.info('注册PassiveListener结束')
      })
    },
    ReverseStream: (call) => {
      const metadata = call.metadata.getMap()
      logger.info('收到 ReverseStream 元数据:', metadata)
      call.on('data', data => {
        logger.info('收到ReverseStream数据:', data)
      })
      call.on('end', () => {
        console.log('反向流结束')
      })
    }
  }
  const authenticationProtoGrpcType = getProtoGrpcType('auth/authentication.proto')
  const eventProtoGrpcType = getProtoGrpcType('event/event.proto')
  const reverseProtoGrpcType = getProtoGrpcType('reverse/reverse.proto')
  const server = new grpc.Server()
  // server.addService(authenticationProtoGrpcType.kritor.authentication.AuthenticationService.service, authenticationServer)
  server.addService(eventProtoGrpcType.kritor.event.EventService.service, authenticationServer)
  server.addService(reverseProtoGrpcType.kritor.reverse.ReverseService.service, authenticationServer)

  server.bindAsync('0.0.0.0:7001', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      logger.error('grpc服务器启动失败：', err)
    } else {
      logger.log('grpc服务启动成功，监听端口：', port)
      // server.start() // 启动服务器
    }
  })
}

// 初始化 gRPC 服务器
init()
