import Api from './api.js'
import * as grpc from '@grpc/grpc-js'
import Converters from './converter.js'
import { proto, kritor } from 'kritor-proto'
import * as protoLoader from '@grpc/proto-loader'

export default class Kritor {
  #server

  /**
   * @private
   * @type {import('../../index.js').logger}
   */
  #logger

  /**
   * @private
   * @type {import('../../index.js').common}
   */
  #common

  /**
   * @private
   * @type {import('../../index.js').config}
   */
  #config

  /**
   * @private
   * @type {import('../../index.js').listener}
   */
  listener
  constructor (logger, common, config, listener) {
    this.dir = proto
    this.#logger = logger
    this.#common = common
    this.#config = config
    this.listener = listener
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
      oneofs: true,
    })
    return grpc.loadPackageDefinition(definition)
  }

  /**
   * 初始化 gRPC 服务器
   */
  init () {
    try {
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
            this.#logger.debug('上报事件：', data)
            // 事件分发according to data.type
            switch (data.type) {
              /** 消息事件 */
              case kritor.event.EventType.EVENT_TYPE_MESSAGE: {
                const message = Converters.messageConverter.convert(data.message, uin || uid)
                this.listener.emit('message', message)
                break
              }
              /** 通知事件 */
              case kritor.event.EventType.EVENT_TYPE_NOTICE: {
                const notice = Converters.noticeConverter.convert(data.notice, uin || uid)
                this.listener.emit('notice', notice)
                break
              }
              /** 请求事件 */
              case kritor.event.EventType.EVENT_TYPE_REQUEST: {
                const request = Converters.requestConverter.convert(data.request, uin || uid)
                this.listener.emit('request', request)
                break
              }
              /** 元事件 */
              case kritor.event.EventType.EVENT_TYPE_CORE_EVENT: {
                this.#logger.info('核心事件: ' + JSON.stringify(data.toJSON()))
              }
            }
          })
        },
        ReverseStream: (call) => {
          const metadata = call.metadata.getMap()
          const { 'kritor-self-uid': uid, 'kritor-self-uin': uin } = metadata
          this.#logger.info('收到反向流请求：', metadata)

          const bot = new Api(call, { uid, uin }, this.#logger, this.#common, this.#config, this.listener)
          /** 注册bot */
          this.listener.emit('bot', { type: 'grpc', bot })
        },
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

      this.#server.bindAsync(this.#config.Server.grpc.host, grpc.ServerCredentials.createInsecure(), (err) => {
        if (err) {
          this.#logger.error('grpc服务器启动失败：', err)
        } else {
          this.#logger.info('[服务器][启动成功][grpc]: ', this.#logger.green(`http://${this.#config.Server.grpc.host}`))
        }
      })

      this.listener.once('restart.grpc', () => {
        this.#logger.mark('[服务器][重启][grpc] 正在重启grpc服务器...')
        this.#restart()
      })

      /** 关闭 gRPC 服务器 */
      this.listener.once('exit_grpc', () => this.#server.forceShutdown())
    } catch (error) {
      this.#logger.error('初始化grpc服务器失败: ', error)
    }
  }

  /** 重启 gRPC 服务器 */
  async #restart () {
    this.#server.forceShutdown()
    /** 延迟1秒 */
    await this.#common.sleep(1000)
    this.init()
  }
}
