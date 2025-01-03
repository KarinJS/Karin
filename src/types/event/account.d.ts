/**
 * 适配器账号信息
 */
export interface AccountInfo {
    /** Bot的uin */
    uin: string;
    /** Bot的uid */
    uid: string;
    /** Bot的selfId 一般使用此参数即可 */
    selfId: string;
    /** 账号名 不存在则是空字符串 */
    name: string;
    /** Bot的头像链接 */
    avatar: string;
    /**
     * - Bot的子账号键值对
     * - 结构约定: key=场景 value=id
     * - 此部分由适配器自行实现
     * @example
     * ```json
     * {
     *   "group": "123456",
     *   "guild": "123456",
     *   "friend": "123456",
     *   "direct": "123456"
     * }
     * ```
     */
    subId: Record<string, string>;
}
