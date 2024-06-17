/**
 * 发送上线通知
 */
export default class Online {
  constructor (level, segment, listener) {
    this.level = level
    this.segment = segment
    this.listener = listener
    this.listener.on('karin:online', this.start.bind(this))
    setTimeout(() => this.listener.off('karin:online', this.start.bind(this)), 30000)
  }

  async start (uid) {
    /** 重启 */
    const key = `karin:restart:${uid}`
    let options = ''
    try {
      options = await this.level.get(key)
    } catch { }
    if (!options) return
    const { id, contact, time, message_id } = options
    /** 重启花费时间 保留2位小数 */
    const restartTime = ((Date.now() - time) / 1000).toFixed(2)
    /** 如果超过5分钟 则删除并跳过 */
    if (restartTime > 300) {
      await this.level.del(key)
      return false
    }

    const element = [
      this.segment.reply(message_id),
      this.segment.text(`Karin 重启成功：${restartTime}秒`),
    ]
    await this.listener.sendMsg(id, contact, element)
    await this.level.del(key)
    return true
  }
}
