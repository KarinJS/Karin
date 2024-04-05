import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { kritor } from './proto/message/message.js'
import { logger } from '#Karin'

let seq = 0
let call_1
let call_2

/**
 * 获取 proto 文件
 * @param {string} filename
 * @param {string[]} dirs
 * @returns {unknown}
 */
function getProtoGrpcType (filename) {
  filename = process.cwd() + '/lib/adapter/kritor/kritor/protos/' + filename
  const dirs = [process.cwd() + '/lib/adapter/kritor/kritor/protos']
  const definition = protoLoader.loadSync(filename, {
    includeDirs: dirs,
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
  return grpc.loadPackageDefinition(definition)
}

/** 初始化 gRPC 服务器 */
function init () {
  const authenticationProtoGrpcType = getProtoGrpcType('auth/authentication.proto')
  const eventProtoGrpcType = getProtoGrpcType('event/event.proto')
  const reverseProtoGrpcType = getProtoGrpcType('reverse/reverse.proto')
  // const message_dataProtoGrpcType = getProtoGrpcType('common/message_data.proto')
  const messageProtoGrpcType = getProtoGrpcType('message/message.proto')
  // const MessageService = messageProtoGrpcType.kritor.message.MessageService
  const authenticationServer = {
    RegisterPassiveListener: (call, callback) => {
      call_1 = call
      call.on('data', event => {
        console.log('收到事件:', event)
        logger.info(event.message.elements)
      }, 'utf8')
      call.on('end', () => {
        logger.info('注册PassiveListener结束')
      })
    },
    ReverseStream: (call) => {
      call_2 = call
      const metadata = call.metadata.getMap()
      logger.info('收到 ReverseStream 元数据:', metadata)
      call.on('data', data => {
        logger.info('收到ReverseStream数据:', data)
      })
      call.on('end', () => {
        console.log('反向流结束')
      })
    },
    SendMessage: (call) => {
      console.log(call)
    }
  }

  const server = new grpc.Server()
  server.addService(authenticationProtoGrpcType.kritor.authentication.AuthenticationService.service, authenticationServer)
  server.addService(eventProtoGrpcType.kritor.event.EventService.service, authenticationServer)
  server.addService(reverseProtoGrpcType.kritor.reverse.ReverseService.service, authenticationServer)
  server.addService(messageProtoGrpcType.kritor.message.MessageService.service, authenticationServer)

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

function test (elements) {
  const buf = kritor.message.SendMessageRequest.encode({
    contact: { scene: 'group', peer: '718989221' },
    elements
  }).finish()
  let params = { cmd: 'MessageService.SendMessage', seq, buf }
  call_2.write(params)
  seq++
}
export default test
