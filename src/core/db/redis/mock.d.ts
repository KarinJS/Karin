import EventEmitter from 'node:events';
import type { SetOptions } from 'redis';
/**
 * @description 键类型枚举
 */
declare const enum Key {
    /** 字符串 */
    STR = "str",
    /** 数字 */
    NUM = "num",
    /** 哈希表 */
    HASH = "hash",
    /** 列表 */
    LIST = "list",
    /** 集合 */
    SET = "set",
    /** 有序集合 */
    ZSET = "zset",
    /** HyperLogLog */
    PF = "pf",
    /** 位图 */
    BIT = "bit"
}
/**
 * @description 轻量化的 Redis 客户端 仅支持部分命令
 * @class RedisClient
 */
export declare class RedisClient extends EventEmitter {
    #private;
    constructor();
    init(): Promise<this>;
    /**
     * @description 检查过期
     * @param key 键
     * @param isRemove 是否删除 默认删除
     * @returns 是否过期或值
     */
    private checkExpire;
    /**
     * @description 获取键的类型
     * @param key 键
     * @returns 键的类型
     */
    type(key: string): `${Key}` | undefined;
    /**
     * @description 存储键值对
     * @param key 键
     * @param value 值
     * @param options 其他参数
     */
    set(key: string, value: string | Buffer, options?: SetOptions): Promise<string | Buffer | null>;
    /**
     * @description 获取键值
     * @param key 键
     */
    get(key: string): Promise<string | null>;
    /**
     * @description 删除键
     * @param key 键
     */
    del(key: string): Promise<number>;
    /**
     * @description 检查键是否存在
     * @param key 键
     */
    exists(key: string): Promise<number>;
    /**
     * @description 设置键的过期时间
     * @param key 键
     * @param seconds 过期时间（秒）
     */
    expire(key: string, seconds: number): Promise<number>;
    /**
     * @description 获取键的过期时间
     * @param key 键
     */
    ttl(key: string): Promise<number>;
    /**
     * @description 获取所有键
     * @param pattern 匹配规则
     */
    keys(pattern: string): Promise<string[]>;
    /**
     * @description 清空所有键
     */
    flushAll(): Promise<string>;
    /**
     * @description 自增
     * @param key 键
     */
    incr(key: string): Promise<number>;
    /**
     * @description 自减
     * @param key 键
     */
    decr(key: string): Promise<number>;
    /**
     * @description 追加字符串
     * @param key 键
     * @param value 值
     */
    append(key: string, value: string | Buffer): Promise<number>;
    /**
    * @description
    * @param key
    * @param field
    * @param value
    * @returns
    */
    /**
     * 将字段和值设置到指定键的哈希表中
     * 如果键不存在，则创建一个新的哈希表
     * @param key 哈希表的键
     * @param field 哈希表中的字段
     * @param value 要设置的值，可以是字符串或缓冲区
     * @returns 返回 1 表示设置成功，0 表示设置失败
     */
    hSet(key: string, field: string, value: string | Buffer): Promise<number>;
    /**
     * 获取哈希表字段的值
     * @param key 哈希表的键
     * @param field 哈希表中的字段
     * @returns 返回字段的值，如果字段不存在则返回 null
     */
    hGet(key: string, field: string): Promise<string | null>;
    /**
     * 删除哈希表中的一个或多个字段
     * @param key 哈希表的键
     * @param field 要删除的字段
     * @returns 返回成功删除的字段数量
     */
    hDel(key: string, field: string): Promise<number>;
    /**
     * 获取哈希表中所有字段的值
     * @param key 哈希表的键
     * @returns 返回所有字段的值
     */
    hGetAll(key: string): Promise<Record<string, string>>;
    /**
     * 将一个或多个值插入到列表的头部
     * @param key 列表的键
     * @param values 要插入的值
     */
    lPush(key: string, ...values: (string | Buffer)[]): Promise<number>;
    /**
     * 将一个或多个值插入到列表的尾部
     * @param key 列表的键
     * @param values 要插入的值
     */
    rPush(key: string, ...values: (string | Buffer)[]): Promise<number>;
    /**
     * 移除并返回列表的第一个元素
     * @param key 列表的键
     * @returns 返回列表的第一个元素，如果列表为空则返回 null
     */
    lPop(key: string): Promise<string | null>;
    /**
     * 移除并返回列表的最后一个元素
     * @param key 列表的键
     * @returns 返回列表的最后一个元素，如果列表为空则返回 null
     */
    rPop(key: string): Promise<string | null>;
    /**
     * 返回列表指定范围内的元素
     * @param key 列表的键
     * @returns 返回列表指定范围内的元素
     */
    lRange(key: string, start: number, stop: number): Promise<string[]>;
    /**
     * 向集合添加一个或多个成员
     * @param key 集合的键
     * @param members 要添加的成员
     * @returns 返回成功添加的成员数量
     */
    sAdd(key: string, ...members: (string | Buffer)[]): Promise<number>;
    /**
     * 从集合中移除一个或多个成员
     * @param key 集合的键
     * @param members 要移除的成员
     * @returns 返回成功移除的成员数量
     */
    sRem(key: string, ...members: (string | Buffer)[]): Promise<number>;
    /**
     * 返回集合的所有成员
     * @param key 集合的键
     * @returns 返回集合的所有成员
     */
    sMembers(key: string): Promise<string[]>;
    /**
     * 检查成员是否是集合的成员
     * @param key 集合的键
     * @param member 要检查的成员
     * @returns 返回 1 表示是集合的成员，0 表示不是集合的成员
     */
    sismember(key: string, member: string | Buffer): Promise<number>;
    /**
     * 向有序集合添加一个或多个成员
     * @param key 有序集合的键
     * @param score 分数
     * @param member 成员
     * @returns 返回成功添加的成员数量
     */
    zAdd(key: string, score: number, member: string | Buffer): Promise<number>;
    /**
     * 返回有序集合的成员数量
     * @param key 有序集合的键
     * @returns 返回有序集合的成员数量
     */
    zRange(key: string, start: number, stop: number): Promise<string[]>;
    /**
     * 从有序集合中移除一个或多个成员
     * @param key 有序集合的键
     * @param members 要移除的成员
     * @returns 返回成功移除的成员数量
     */
    zRem(key: string, member: string | Buffer): Promise<number>;
    /**
     * 返回有序集合的成员数量
     * @param key 有序集合的键
     * @returns 返回有序集合的成员数量
     */
    zcard(key: string): Promise<number>;
    /**
     * 返回有序集合中指定成员的排名
     * @param key 有序集合的键
     * @param member 成员
     * @returns 返回成员的排名，如果成员不存在则返回 null
     */
    zRank(key: string, member: string | Buffer): Promise<number | null>;
    /**
     * 返回有序集合中指定成员的分数
     * @param key 有序集合的键
     * @param member 成员
     * @returns 返回成员的分数，如果成员不存在则返回 null
     */
    zScore(key: string, member: string | Buffer): Promise<number | null>;
    /**
     * 从 HyperLogLog 中添加一个或多个元素
     * @param key HyperLogLog 的键
     * @param elements 要添加的元素
     * @returns 返回 1 表示添加成功，0 表示添加失败
     */
    pfAdd(key: string, ...elements: (string | Buffer)[]): Promise<boolean>;
    /**
     * 返回 HyperLogLog 的基数估算值
     * @param key HyperLogLog 的键
     * @returns 返回基数估算值
     */
    pfCount(key: string): Promise<number>;
    /**
     * 合并多个 HyperLogLog
     * @param destKey 目标 HyperLogLog 的键
     * @param sourceKeys 源 HyperLogLog 的键
     * @returns 返回 1 表示合并成功，0 表示合并失败
     */
    pExpire(key: string, seconds: number): Promise<boolean>;
    /**
     * 设置 HyperLogLog 的过期时间
     * @param key HyperLogLog 的键
     * @param seconds 过期时间（秒）
     * @returns 返回 1 表示设置成功，0 表示设置失败
     */
    pTTL(key: string): Promise<number>;
    /**
     * 为键设置到某个特定时间点的过期时间
     * @param key HyperLogLog 的键
     * @param seconds 过期时间（毫秒）
     * @returns 返回布尔值
     */
    pExpireAt(key: string, timestamp: number): Promise<boolean>;
    /**
     * @description 发布消息到频道
     * @param channel 频道
     * @param message 消息
     * @returns 返回订阅者数量
     */
    publish(channel: string, message: string | Buffer): Promise<number>;
    /**
     * @description 订阅一个或多个频道
     * @param channels 频道
     * @param listener 监听器
     * @returns 返回订阅的频道数量
     */
    subscribe(channels: string[], listener: (message: string) => void): Promise<number>;
    /**
     * @description 取消订阅一个或多个频道
     * @param channels 频道
     * @param listener 监听器
     * @returns 返回取消订阅的频道数量
     */
    unsubscribe(channels: string[], listener: (message: string) => void): Promise<number>;
    /**
     * @description 设置位图指定偏移量的值
     * @param key 键
     * @param offset 偏移量
     * @param value 值
     * @returns 返回设置前的位
     */
    setBit(key: string, offset: number, value: number): Promise<number>;
    /**
     * @description 获取位图指定偏移量的值
     * @param key 键
     * @param offset 偏移量
     * @returns 返回位
     */
    getBit(key: string, offset: number): Promise<number>;
    /**
     * @description 获取位图的指定范围内的位
     * @param key 键
     * @param start 起始偏移量
     * @param end 结束偏移量
     * @returns 返回位数组
     */
    getRange(key: string, start: number, end: number): Promise<number[]>;
    save(): Promise<string>;
}
export {};
