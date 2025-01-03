/** 消息事件插件类 */
export class Plugin {
    /** 插件名称 */
    name;
    /** 指令规则集 */
    rule;
    /** 插件描述 */
    desc;
    /** 插件事件 */
    event;
    /** 优先级 */
    priority;
    /** 消息事件对象 */
    e;
    /** 调用后将继续匹配下一个插件 */
    next;
    /** 快速回复 */
    reply;
    constructor(options) {
        const { name, rule } = options;
        this.name = name;
        this.rule = rule;
        this.desc = options.desc || '无描述';
        this.event = (options.event || 'message');
        this.priority = options.priority || 10000;
        this.reply = this.e.reply.bind(this.e);
    }
    /**
     * 快速回复合并转发
     * @param element 合并转发消息元素节点
     */
    async replyForward(element) {
        const result = await this.e.bot.sendForwardMsg(this.e.contact, element);
        return {
            ...result,
            /** @deprecated 已废弃 请请使用 messageId */
            message_id: result.messageId,
        };
    }
}
