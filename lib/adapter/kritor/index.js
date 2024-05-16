import Api from './api.js'
import { proto } from 'kritor-proto'
import * as grpc from '@grpc/grpc-js'
import Converters from './converter.js'
import * as protoLoader from '@grpc/proto-loader'
import { Bot, logger, kritor, Cfg, common } from '#Karin'

export default class Kritor {
  #server
  constructor () {
    this.dir = proto
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
        let bot = Bot.adapter[uid]
        /** 监听上报事件 */
        call.on('data', data => {
          logger.debug('上报事件：', data)
          // 事件分发according to data.type
          switch (data.type) {
            /** 消息事件 */
            case kritor.event.EventType.EVENT_TYPE_MESSAGE: {
              const message = Converters.messageConverter.convert(data.message, uin || uid)
              message.bot = bot
              Bot.emit('message', message)
              break
            }
            /** 通知事件 */
            case kritor.event.EventType.EVENT_TYPE_NOTICE: {
              const notice = Converters.noticeConverter.convert(data.notice, uin || uid)
              notice.bot = bot
              Bot.emit('notice', notice)
              break
            }
            /** 请求事件 */
            case kritor.event.EventType.EVENT_TYPE_REQUEST: {
              const request = Converters.requestConverter.convert(data.request, uin || uid)
              request.bot = bot
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

    this.#server = new grpc.Server()
    this.#server.addService(coreProtoGrpcType.kritor.core.CoreService.service, authenticationServer)
    this.#server.addService(authenticationProtoGrpcType.kritor.authentication.AuthenticationService.service, authenticationServer)
    this.#server.addService(eventProtoGrpcType.kritor.event.EventService.service, authenticationServer)
    this.#server.addService(reverseProtoGrpcType.kritor.reverse.ReverseService.service, authenticationServer)
    this.#server.addService(messageProtoGrpcType.kritor.message.MessageService.service, authenticationServer)
    this.#server.addService(friendGrpcType.kritor.friend.FriendService.service, authenticationServer)
    this.#server.addService(groupGrpcType.kritor.group.GroupService.service, authenticationServer)
    this.#server.addService(guildGrpcType.kritor.guild.GuildService.service, authenticationServer)
    this.#server.addService(GroupFileGrpcType.kritor.file.GroupFileService.service, authenticationServer)
    this.#server.addService(customizationGrpcType.kritor.customization.CustomizationService.service, authenticationServer)
    this.#server.addService(developerGrpcType.kritor.developer.DeveloperService.service, authenticationServer)
    this.#server.addService(QsignGrpcType.kritor.developer.QsignService.service, authenticationServer)
    this.#server.addService(webGrpcType.kritor.web.WebService.service, authenticationServer)

    this.#server.bindAsync(Cfg.Config.grpc, grpc.ServerCredentials.createInsecure(), (err) => {
      if (err) {
        logger.error('grpc服务器启动失败：', err)
      } else {
        logger.info(`[服务器][启动成功][grpc][http://${Cfg.Config.grpc}]`)
      }
    })

    Bot.once('restart_grpc', () => {
      logger.mark('[服务器][重启][grpc] 正在重启grpc服务器...')
      this.#restart()
    })
  }

  /** 重启 gRPC 服务器 */
  async #restart () {
    this.#server.forceShutdown()
    /** 延迟1秒 */
    await common.sleep(1000)
    this.init()
  }
}
