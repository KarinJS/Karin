/**
 * 构建文本元素
 * @param text 文本内容
 */
export const text = (text) => {
    return { type: 'text', text };
};
/**
 * 构建At元素
 * @param targetId 目标id atall=all at在线成员=online
 * @param name At的名称
 */
export const at = (targetId, name) => {
    return { type: 'at', targetId, name };
};
/**
 * 构建表情元素
 * @param id 表情ID
 * @param isBig 是否大表情，默认不是
 */
export const face = (id, isBig) => {
    return { type: 'face', id: Number(id), isBig };
};
/**
 * 构建回复元素
 * @param messageId 回复的消息ID
 */
export const reply = (messageId) => {
    return { type: 'reply', messageId: String(messageId) };
};
/**
 * 构建图片元素
 * @param file 图片url、路径或者base64
 * @param fileType 图片类型
 * @param options 其他可选参数
 */
export const image = (file, options = {}) => {
    return {
        type: 'image',
        file,
        fileType: options.fileType,
        height: options?.height,
        width: options?.width,
        md5: options?.md5,
        name: options?.name,
        subType: options?.subType,
    };
};
/**
 * 构建视频元素
 * @param file 视频url、路径或者base64
 * @param options 其他可选参数
 */
export const video = (file, options) => {
    return {
        type: 'video',
        file,
        height: options?.height,
        width: options?.width,
        md5: options?.md5,
        name: options?.name,
    };
};
/**
 * 构建语音元素
 * @param file 语音文件url、路径或者base64
 * @param magic 是否为魔法语音 默认不是
 * @param options 其他可选参数
 */
export const record = (file, magic = false, options) => {
    return {
        type: 'record',
        file,
        magic,
        md5: options?.md5,
        name: options?.name,
    };
};
/**
 * 构建JSON元素
 * @param data JSON内容
 */
export const json = (data) => {
    return { type: 'json', data };
};
/**
 * 构建XML元素
 * @param data XML内容
 */
export const xml = (data) => {
    return { type: 'xml', data };
};
/**
 * 构建Markdown元素
 * @param markdown Markdown内容
 * @param config 配置参数
 */
export const markdown = (markdown, config) => {
    return { type: 'markdown', markdown, config };
};
/**
 * 构建Markdown模板元素
 * @param templateId 模板ID
 * @param params 模板参数
 */
export const markdownTpl = (templateId, params) => {
    return { type: 'markdownTpl', templateId, params };
};
/**
 * 构建被动事件元素
 * @param id 被动事件ID
 * @param source 事件id来源 默认为msg
 */
export const pasmsg = (id, source = 'msg') => {
    return { type: 'pasmsg', id, source };
};
/**
 * 构建多行按钮元素
 * @param data 按钮行数组
 */
export const keyboard = (data) => {
    const rows = [];
    if (!Array.isArray(data))
        data = [data];
    for (const i of data) {
        if (Array.isArray(i)) {
            const button = [];
            for (const v of i)
                button.push(v);
            rows.push(button);
        }
        else {
            rows.push([i]);
        }
    }
    return { type: 'keyboard', rows };
};
/**
 * 构建单行按钮元素
 * @param data 按钮数组
 */
export const button = (data) => {
    return { type: 'button', data: Array.isArray(data) ? data : [data] };
};
/**
 * 构建长消息元素
 * @param id 消息ID
 */
export const longMsg = (id) => {
    return { type: 'longMsg', id };
};
/**
 * 构建原始元素
 * @param data 原始数据
 */
export const raw = (data) => {
    return { type: 'raw', data };
};
/**
 * 构建篮球元素
 * @param id 篮球ID
 */
export const basketball = (id) => {
    return { type: 'basketball', id: Number(id) };
};
/**
 * 构建骰子元素
 * @param id 骰子ID
 */
export const dice = (id) => {
    return { type: 'dice', id: Number(id) };
};
/**
 * 构建猜拳元素
 * @param id 猜拳ID
 */
export const rps = (id) => {
    return { type: 'rps', id: Number(id) };
};
/**
 * 构建弹射表情元素
 * @param id 表情ID
 * @param count 表情数量
 */
export const bubbleFace = (id, count) => {
    return { type: 'bubbleFace', id: Number(id), count: Number(count) };
};
/**
 * 构建天气元素
 * @param city 城市名称
 * @param code 城市代码
 */
export const weather = (city, code) => {
    return { type: 'weather', city, code };
};
/**
 * 构建位置元素
 * @param lat 纬度
 * @param lon 经度
 * @param title 标题
 * @param address 地址
 */
export const location = (lat, lon, title, address) => {
    return { type: 'location', lat, lon, title, address };
};
/**
 * 构建分享元素
 * @param url 分享链接
 * @param title 分享标题
 * @param content 分享内容
 * @param image 分享图片
 */
export const share = (url, title, content, image) => {
    return { type: 'share', url, title, content, image };
};
/**
 * 构建礼物元素
 * @param qq QQ号
 * @param id 礼物ID
 */
export const gift = (qq, id) => {
    return { type: 'gift', qq, id };
};
/**
 * 构建商城表情元素
 * @param id 表情ID
 */
export const marketFace = (id) => {
    return { type: 'marketFace', id };
};
/**
 * 构建分享名片元素
 * @param scene 分享类型
 * @param peer 被推荐人的QQ号或者被推荐群的群号
 */
export const contact = (scene, peer) => {
    return { type: 'contact', scene, peer };
};
/**
 * 构建常规音乐元素
 * @param id 歌曲ID或自定义音乐选项
 * @param platform 音乐平台
 */
export const music = (platform, id) => {
    return { type: 'music', platform, id };
};
/**
 * 构建自定义音乐元素
 * @param url 跳转链接
 * @param audio 音乐音频链接
 * @param title 标题
 * @param author 歌手
 * @param pic 封面
 */
export const customMusic = (url, audio, title, author, pic) => {
    return { type: 'music', platform: 'custom', url, audio, title, author, pic };
};
/**
 * 构建自定义转发节点元素
 * @param userId 目标ID
 * @param nickname 目标名称
 * @param message 转发的消息元素结构
 * @param options 外显设置 暂未实现
 */
export const node = (userId, nickname, message, options) => {
    /** 自定义 */
    return { type: 'node', subType: 'fake', userId, nickname, message, options };
};
/**
 * 构建直接转发节点元素
 * @param id 消息ID
 */
export const nodeDirect = (id) => {
    return { type: 'node', subType: 'messageID', messageId: id, message_id: id };
};
