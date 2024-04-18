import fs from 'fs'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import Api from './api.js'
import Converters from './converter.js'
import Submodule from '../../init/Submodule.js'
import { Bot, logger, kritor, Cfg } from '#Karin'

export default class Kritor {
  constructor () {
    this.proto_dir = {
      github: process.cwd() + '/lib/adapter/kritor/kritor/protos',
      gitee: process.cwd() + '/lib/adapter/kritor/gitee_kritor/protos'
    }
    this.dir = this.proto_dir.github
  }

  async initProto () {
    /** 检查github proto是否存在 */
    if (!fs.existsSync(this.proto_dir.github)) {
      if (fs.existsSync(this.proto_dir.gitee)) {
        /** 更换为gitee proto */
        this.dir = this.proto_dir.gitee
      } else {
        /** 都不存在，则进行拉取 */
        const submodule = new Submodule(logger)
        const name = await submodule.main()
        this.dir = name === 'kritor' ? this.proto_dir.github : this.proto_dir.gitee
      }
    }
  }

  /**
   * 获取 proto 文件
   * @param {string} filename
   * @param {string[]} dirs
   * @returns {unknown}
   */
  getProtoGrpcType (filename) {
    filename = `${this.dir}/${filename}`
    const dirs = [this.dir]
    const definition = protoLoader.loadSync(filename, {
      includeDirs: dirs,
      keepCase: true,
      longs: String,
      // enums: String,
      defaults: true,
      oneofs: true
    })
    return grpc.loadPackageDefinition(definition)
  }

  /** 初始化 gRPC 服务器 */
  init () {
    const authenticationProtoGrpcType = this.getProtoGrpcType('auth/authentication.proto')
    const coreProtoGrpcType = this.getProtoGrpcType('core/core.proto')
    const customizationGrpcType = this.getProtoGrpcType('developer/customization.proto')
    const developerGrpcType = this.getProtoGrpcType('developer/developer.proto')
    const QsignGrpcType = this.getProtoGrpcType('developer/qsign.proto')
    const eventProtoGrpcType = this.getProtoGrpcType('event/event.proto')
    const GroupFileGrpcType = this.getProtoGrpcType('file/group_file.proto')
    const friendGrpcType = this.getProtoGrpcType('friend/friend.proto')
    const groupGrpcType = this.getProtoGrpcType('group/group.proto')
    const guildGrpcType = this.getProtoGrpcType('guild/guild.proto')
    const messageProtoGrpcType = this.getProtoGrpcType('message/message.proto')
    const reverseProtoGrpcType = this.getProtoGrpcType('reverse/reverse.proto')
    const webGrpcType = this.getProtoGrpcType('web/web.proto')

    const authenticationServer = {
      /**
       *
       * @param {grpc.ServerReadableStream<kritor.event.EventStructure, kritor.event.RequestPushEvent>} call
       * @constructor
       */
      RegisterPassiveListener: (call) => {
        const metadata = call.metadata.getMap()
        const { 'kritor-self-uid': uid, 'kritor-self-uin': uin } = metadata

        /** 监听上报事件 */
        call.on('data', data => {
          logger.debug('上报事件：', data)
          // 事件分发according to data.type
          switch (data.type) {
            /** 消息事件 */
            case kritor.event.EventType.EVENT_TYPE_MESSAGE: {
              const message = Converters.messageConverter.convert(data.message, uin || uid)
              Bot.emit('message', message)
              break
            }
            /** 通知事件 */
            case kritor.event.EventType.EVENT_TYPE_NOTICE: {
              const notice = Converters.noticeConverter.convert(data.notice, uin || uid)
              Bot.emit('notice', notice)
              break
            }
            /** 请求事件 */
            case kritor.event.EventType.EVENT_TYPE_REQUEST: {
              const request = Converters.requestConverter.convert(data.request, uin || uid)
              Bot.emit('request', request)
              break
            }
            /** 元事件 */
            case kritor.event.EventType.EVENT_TYPE_CORE_EVENT: {
              logger.info('核心事件: ' + JSON.stringify(data.toJSON()))
            }
          }
        })
      },
      ReverseStream: (call) => {
        const metadata = call.metadata.getMap()
        const { 'kritor-self-uid': uid, 'kritor-self-uin': uin } = metadata
        logger.info('收到反向流请求：', metadata)

        const bot = new Api(call, { uid, uin })
        /** 注册bot */
        Bot.emit('bot', bot)
      }
    }

    const server = new grpc.Server()
    server.addService(coreProtoGrpcType.kritor.core.CoreService.service, authenticationServer)
    server.addService(authenticationProtoGrpcType.kritor.authentication.AuthenticationService.service, authenticationServer)
    server.addService(eventProtoGrpcType.kritor.event.EventService.service, authenticationServer)
    server.addService(reverseProtoGrpcType.kritor.reverse.ReverseService.service, authenticationServer)
    server.addService(messageProtoGrpcType.kritor.message.MessageService.service, authenticationServer)
    server.addService(friendGrpcType.kritor.friend.FriendService.service, authenticationServer)
    server.addService(groupGrpcType.kritor.group.GroupService.service, authenticationServer)
    server.addService(guildGrpcType.kritor.guild.GuildService.service, authenticationServer)
    server.addService(GroupFileGrpcType.kritor.file.GroupFileService.service, authenticationServer)
    server.addService(customizationGrpcType.kritor.customization.CustomizationService.service, authenticationServer)
    server.addService(developerGrpcType.kritor.developer.DeveloperService.service, authenticationServer)
    server.addService(QsignGrpcType.kritor.developer.QsignService.service, authenticationServer)
    server.addService(webGrpcType.kritor.web.WebService.service, authenticationServer)

    server.bindAsync(Cfg.Config.grpc, grpc.ServerCredentials.createInsecure(), (err) => {
      if (err) {
        logger.error('grpc服务器启动失败：', err)
      } else {
        logger.info(`[服务器][启动成功][grpc][http://${Cfg.Config.grpc}]`)
      }
    })
    /** 监听程序退出事件 关闭服务器 */
    process.on('exit', () => server.forceShutdown())
  }
}
