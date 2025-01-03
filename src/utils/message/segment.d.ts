import type { TextElement, AtElement, FaceElement, ReplyElement, ImageElement, VideoElement, RecordElement, JsonElement, XmlElement, MarkdownElement, MarkdownTplElement, PasmsgElement, KeyboardElement, ButtonElement, LongMsgElement, RawElement, BasketballElement, DiceElement, RpsElement, BubbleFaceElement, WeatherElement, LocationElement, ShareElement, GiftElement, MarketFaceElement, ContactElement, DirectNodeElement, CustomNodeElement, KarinButton, ReadyMusicElement, CustomMusicElement } from '@/types/segment';
/**
 * 构建文本元素
 * @param text 文本内容
 */
export declare const text: (text: string) => TextElement;
/**
 * 构建At元素
 * @param targetId 目标id atall=all at在线成员=online
 * @param name At的名称
 */
export declare const at: (targetId: string, name?: string) => AtElement;
/**
 * 构建表情元素
 * @param id 表情ID
 * @param isBig 是否大表情，默认不是
 */
export declare const face: (id: number, isBig?: boolean) => FaceElement;
/**
 * 构建回复元素
 * @param messageId 回复的消息ID
 */
export declare const reply: (messageId: string) => ReplyElement;
/**
 * 构建图片元素
 * @param file 图片url、路径或者base64
 * @param fileType 图片类型
 * @param options 其他可选参数
 */
export declare const image: (file: string, options?: Partial<ImageElement>) => ImageElement;
/**
 * 构建视频元素
 * @param file 视频url、路径或者base64
 * @param options 其他可选参数
 */
export declare const video: (file: string, options?: Partial<Omit<VideoElement, "type" | "file">>) => VideoElement;
/**
 * 构建语音元素
 * @param file 语音文件url、路径或者base64
 * @param magic 是否为魔法语音 默认不是
 * @param options 其他可选参数
 */
export declare const record: (file: string, magic?: boolean, options?: Partial<Omit<RecordElement, "type" | "file" | "magic">>) => RecordElement;
/**
 * 构建JSON元素
 * @param data JSON内容
 */
export declare const json: (data: string) => JsonElement;
/**
 * 构建XML元素
 * @param data XML内容
 */
export declare const xml: (data: string) => XmlElement;
/**
 * 构建Markdown元素
 * @param markdown Markdown内容
 * @param config 配置参数
 */
export declare const markdown: (markdown: string, config?: MarkdownElement["config"]) => MarkdownElement;
/**
 * 构建Markdown模板元素
 * @param templateId 模板ID
 * @param params 模板参数
 */
export declare const markdownTpl: (templateId: string, params: MarkdownTplElement["params"]) => MarkdownTplElement;
/**
 * 构建被动事件元素
 * @param id 被动事件ID
 * @param source 事件id来源 默认为msg
 */
export declare const pasmsg: (id: string, source?: PasmsgElement["source"]) => PasmsgElement;
/**
 * 构建多行按钮元素
 * @param data 按钮行数组
 */
export declare const keyboard: (data: Array<Array<KarinButton>>) => KeyboardElement;
/**
 * 构建单行按钮元素
 * @param data 按钮数组
 */
export declare const button: (data: KarinButton | Array<KarinButton>) => ButtonElement;
/**
 * 构建长消息元素
 * @param id 消息ID
 */
export declare const longMsg: (id: string) => LongMsgElement;
/**
 * 构建原始元素
 * @param data 原始数据
 */
export declare const raw: (data: any) => RawElement;
/**
 * 构建篮球元素
 * @param id 篮球ID
 */
export declare const basketball: (id: number) => BasketballElement;
/**
 * 构建骰子元素
 * @param id 骰子ID
 */
export declare const dice: (id: number) => DiceElement;
/**
 * 构建猜拳元素
 * @param id 猜拳ID
 */
export declare const rps: (id: number) => RpsElement;
/**
 * 构建弹射表情元素
 * @param id 表情ID
 * @param count 表情数量
 */
export declare const bubbleFace: (id: number, count: number) => BubbleFaceElement;
/**
 * 构建天气元素
 * @param city 城市名称
 * @param code 城市代码
 */
export declare const weather: (city: string, code: string) => WeatherElement;
/**
 * 构建位置元素
 * @param lat 纬度
 * @param lon 经度
 * @param title 标题
 * @param address 地址
 */
export declare const location: (lat: number, lon: number, title: string, address: string) => LocationElement;
/**
 * 构建分享元素
 * @param url 分享链接
 * @param title 分享标题
 * @param content 分享内容
 * @param image 分享图片
 */
export declare const share: (url: string, title: string, content: string, image: string) => ShareElement;
/**
 * 构建礼物元素
 * @param qq QQ号
 * @param id 礼物ID
 */
export declare const gift: (qq: number, id: number) => GiftElement;
/**
 * 构建商城表情元素
 * @param id 表情ID
 */
export declare const marketFace: (id: string) => MarketFaceElement;
/**
 * 构建分享名片元素
 * @param scene 分享类型
 * @param peer 被推荐人的QQ号或者被推荐群的群号
 */
export declare const contact: (scene: "group" | "friend", peer: string) => ContactElement;
/**
 * 构建常规音乐元素
 * @param id 歌曲ID或自定义音乐选项
 * @param platform 音乐平台
 */
export declare const music: (platform: ReadyMusicElement["platform"], id: string) => ReadyMusicElement;
/**
 * 构建自定义音乐元素
 * @param url 跳转链接
 * @param audio 音乐音频链接
 * @param title 标题
 * @param author 歌手
 * @param pic 封面
 */
export declare const customMusic: (url: string, audio: string, title: string, author: string, pic: string) => CustomMusicElement;
/**
 * 构建自定义转发节点元素
 * @param userId 目标ID
 * @param nickname 目标名称
 * @param message 转发的消息元素结构
 * @param options 外显设置 暂未实现
 */
export declare const node: (userId: CustomNodeElement["userId"], nickname: CustomNodeElement["nickname"], message: CustomNodeElement["message"], options?: CustomNodeElement["options"]) => CustomNodeElement;
/**
 * 构建直接转发节点元素
 * @param id 消息ID
 */
export declare const nodeDirect: (id: string) => DirectNodeElement;
