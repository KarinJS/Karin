import { Level } from 'level';
import lodash from 'lodash';
import moment from 'moment';
import EventEmitter from 'node:events';
import { redisLevelPath } from '@root';
import { existToMkdirSync } from '@/utils/fs/fsSync';
/**
 * @description 轻量化的 Redis 客户端 仅支持部分命令
 * @class RedisClient
 */
export class RedisClient extends EventEmitter {
    /** 键、类型、过期时间映射 */
    #info = {};
    /** 键值对 */
    #str = {};
    /** 数字对 */
    #num = {};
    /** 哈希表 */
    #hash = {};
    /** 列表 */
    #list = {};
    /** 集合 */
    #set = {};
    /** 有序集合 */
    #zset = {};
    /** HyperLogLog */
    #pf = {};
    /** 位图 */
    #bit = {};
    /** 持久化数据库 */
    #level;
    constructor() {
        super();
        this.#info = {};
        this.#str = {};
        this.#num = {};
        this.#hash = {};
        this.#list = {};
        this.#set = {};
        this.#zset = {};
        this.#pf = {};
        this.#bit = {};
        process.once('exit', () => this.#level.close());
    }
    async init() {
        existToMkdirSync(redisLevelPath);
        this.#level = new Level(redisLevelPath);
        /** 每30秒检查过期 */
        setInterval(() => {
            const keys = Object.keys(this.#info);
            keys.forEach((key) => this.checkExpire(key));
        }, 30000);
        /** 每120秒存一次level */
        setInterval(() => this.save(), 120000);
        const list = await this.#level.keys().all();
        await Promise.all(list.map(async (key) => {
            const data = await this.#level.get(key).catch(() => null);
            if (!data)
                return;
            const { type, expire, value } = JSON.parse(data);
            this.#info[key] = { type, expire };
            switch (type) {
                case "str" /* Key.STR */:
                    this.#str[key] = value;
                    return;
                case "num" /* Key.NUM */:
                    this.#num[key] = Number(value);
                    return;
                case "hash" /* Key.HASH */: {
                    const hash = JSON.parse(value);
                    for (const field in hash) {
                        if (typeof hash[field] !== 'string') {
                            hash[field] = Buffer.from(hash[field]);
                        }
                    }
                    this.#hash[key] = hash;
                    return;
                }
                case "list" /* Key.LIST */: {
                    const list = JSON.parse(value);
                    for (let i = 0; i < list.length; i++) {
                        if (typeof list[i] !== 'string') {
                            list[i] = Buffer.from(list[i]);
                        }
                    }
                    this.#list[key] = list;
                    return;
                }
                case "set" /* Key.SET */: {
                    const list = JSON.parse(value);
                    for (let i = 0; i < list.length; i++) {
                        if (typeof list[i] !== 'string') {
                            list[i] = Buffer.from(list[i]);
                        }
                    }
                    this.#set[key] = new Set(list);
                    return;
                }
                case "zset" /* Key.ZSET */: {
                    const list = JSON.parse(value);
                    for (let i = 0; i < list.length; i++) {
                        if (typeof list[i].member !== 'string') {
                            list[i].member = Buffer.from(list[i].member);
                        }
                    }
                    this.#zset[key] = list;
                    return;
                }
                case "pf" /* Key.PF */: {
                    const list = JSON.parse(value);
                    for (let i = 0; i < list.length; i++) {
                        if (typeof list[i] !== 'string') {
                            list[i] = Buffer.from(list[i]);
                        }
                    }
                    this.#pf[key] = new Set(list);
                    return;
                }
                case "bit" /* Key.BIT */:
                    this.#bit[key] = Buffer.from(value);
            }
        }));
        return this;
    }
    /**
     * @description 检查过期
     * @param key 键
     * @param isRemove 是否删除 默认删除
     * @returns 是否过期或值
     */
    checkExpire(key, isRemove = true) {
        if (!this.#info[key])
            return false;
        if (this.#info[key].expire !== -1 && this.#info[key].expire < moment().valueOf()) {
            if (!isRemove)
                return true;
            this.#del(key);
            return true;
        }
        return false;
    }
    /**
     * @description 直接删除键 不检查是否存在
     * @param key 键
     */
    #del(key) {
        const { type } = this.#info[key];
        delete this.#info[key];
        switch (type) {
            case "str" /* Key.STR */:
                delete this.#str[key];
                break;
            case "num" /* Key.NUM */:
                delete this.#num[key];
                break;
            case "hash" /* Key.HASH */:
                delete this.#hash[key];
                break;
            case "list" /* Key.LIST */:
                delete this.#list[key];
                break;
            case "set" /* Key.SET */:
                delete this.#set[key];
                break;
            case "zset" /* Key.ZSET */:
                delete this.#zset[key];
                break;
            case "pf" /* Key.PF */:
                delete this.#pf[key];
                break;
            case "bit" /* Key.BIT */:
                delete this.#bit[key];
                break;
        }
        logger.trace(`[Redis-mock] 删除键 ${key}`);
    }
    /**
     * @description 获取键的类型
     * @param key 键
     * @returns 键的类型
     */
    type(key) {
        return this.#info[key]?.type;
    }
    /**
     * @description 存储键值对
     * @param key 键
     * @param value 值
     * @param options 其他参数
     */
    async set(key, value, options = {}) {
        /*
        | **参数**       | **对应 Redis 原生选项** | **作用**                            | **说明**                                 |
        |----------------|-------------------------|-------------------------------------|------------------------------------------|
        | `EX`           | `EX`                   | 设置相对过期时间（秒）               | 10 表示键将在 10 秒后过期                |
        | `PX`           | `PX`                   | 设置相对过期时间（毫秒）             | 10000 表示键将在 10000 毫秒后过期        |
        | `EXAT`         | `EXAT`                 | 设置绝对过期时间（秒级时间戳）       | 如 `1700000000` 表示某个 Unix 时间戳     |
        | `PXAT`         | `PXAT`                 | 设置绝对过期时间（毫秒级时间戳）     | 如 `1700000000000` 表示某个时间戳（毫秒）|
        | `NX`           | `NX`                   | 仅当键不存在时设置                   | 防止覆盖已有数据                         |
        | `XX`           | `XX`                   | 仅当键存在时设置                     | 只更新已存在的键                         |
        | `GET`          | `GET`                  | 返回旧值并设置新值                   | 替换时保留旧值，方便后续使用             |
        | `KEEPTTL`      | `KEEPTTL`              | 保持原有过期时间                    | 不更新过期时间
        */
        if (!Buffer.isBuffer(value) && typeof value !== 'string') {
            value = String(value);
        }
        else if (Buffer.isBuffer(value)) {
            value = value.toString();
        }
        /** 参数3如果为空直接保存即可 */
        if (lodash.isEmpty(options)) {
            this.#info[key] = { type: "str" /* Key.STR */, expire: -1 };
            this.#str[key] = value;
            return 'OK';
        }
        let expire = -1;
        /** EX */
        if (options?.EX !== undefined) {
            const EX = Number(options.EX);
            if (!isNaN(EX))
                expire = moment().add(EX, 'seconds').valueOf();
            this.#info[key] = { type: "str" /* Key.STR */, expire };
            this.#str[key] = value;
            /** PX */
        }
        else if (options?.PX !== undefined) {
            const PX = Number(options.PX);
            if (!isNaN(PX))
                expire = moment().add(PX, 'milliseconds').valueOf();
            this.#info[key] = { type: "str" /* Key.STR */, expire };
            this.#str[key] = value;
            /** EXAT */
        }
        else if (options?.EXAT !== undefined) {
            const EXAT = Number(options.EXAT);
            if (!isNaN(EXAT))
                expire = EXAT;
            this.#info[key] = { type: "str" /* Key.STR */, expire };
            this.#str[key] = value;
            /** PXAT */
        }
        else if (options?.PXAT !== undefined) {
            const PXAT = Number(options.PXAT);
            if (!isNaN(PXAT))
                expire = PXAT;
            this.#info[key] = { type: "str" /* Key.STR */, expire };
            /** KEEPTTL */
        }
        else if (options?.KEEPTTL) {
            if (this.#str[key]) {
                this.#str[key] = value;
            }
            else {
                this.#info[key] = { type: "str" /* Key.STR */, expire: -1 };
                this.#str[key] = value;
            }
            /** NX */
        }
        else if (options?.NX) {
            if (!this.#str[key]) {
                this.#info[key] = { type: "str" /* Key.STR */, expire: -1 };
                this.#str[key] = value;
            }
            /** XX */
        }
        else if (options?.XX) {
            if (this.#str[key]) {
                this.#str[key] = value;
            }
            /** GET */
        }
        else if (options?.GET) {
            this.#info[key] = { type: "str" /* Key.STR */, expire: -1 };
            if (this.#str[key]) {
                const oldValue = this.#str[key];
                this.#str[key] = value;
                return oldValue;
            }
            this.#str[key] = value;
            return null;
            /** 默认 */
        }
        else {
            this.#info[key] = { type: "str" /* Key.STR */, expire: -1 };
            this.#str[key] = value;
        }
        return 'OK';
    }
    /**
     * @description 获取键值
     * @param key 键
     */
    async get(key) {
        if (!this.#info[key])
            return null;
        /** 检查过期 */
        if (this.checkExpire(key))
            return null;
        const { type } = this.#info[key];
        if (type === "num" /* Key.NUM */) {
            return String(this.#num[key]);
        }
        else {
            return this.#str[key].toString();
        }
    }
    /**
     * @description 删除键
     * @param key 键
     */
    async del(key) {
        if (!this.#info[key])
            return 0;
        this.#del(key);
        return 1;
    }
    /**
     * @description 检查键是否存在
     * @param key 键
     */
    async exists(key) {
        if (!this.#info[key])
            return 0;
        if (this.checkExpire(key))
            return 0;
        return 1;
    }
    /**
     * @description 设置键的过期时间
     * @param key 键
     * @param seconds 过期时间（秒）
     */
    async expire(key, seconds) {
        if (!this.#info[key])
            return 0;
        this.#info[key].expire = moment().add(seconds, 'seconds').valueOf();
        return 1;
    }
    /**
     * @description 获取键的过期时间
     * @param key 键
     */
    async ttl(key) {
        if (!this.#info[key])
            return -2;
        if (this.#info[key].expire === -1)
            return -1;
        if (this.checkExpire(key))
            return -2;
        return moment(this.#info[key].expire).diff(moment(), 'seconds');
    }
    /**
     * @description 获取所有键
     * @param pattern 匹配规则
     */
    async keys(pattern) {
        const reg = new RegExp(pattern.replace(/\*/g, '.*'));
        const keys = Object.keys(this.#info);
        const result = [];
        await Promise.all(keys.map(async (key) => {
            if (this.checkExpire(key))
                return;
            if (reg.test(key)) {
                result.push(key);
            }
        }));
        return result;
    }
    /**
     * @description 清空所有键
     */
    async flushAll() {
        this.#str = {};
        this.#num = {};
        this.#hash = {};
        this.#list = {};
        this.#set = {};
        this.#zset = {};
        this.#pf = {};
        this.#bit = {};
        this.#info = {};
        return 'OK';
    }
    /**
     * @description 自增
     * @param key 键
     */
    async incr(key) {
        if (!this.#num[key]) {
            this.#num[key] = 0;
        }
        else if (this.checkExpire(key, false)) {
            this.#info[key].expire = -1;
            this.#num[key] = 0;
        }
        this.#num[key] += 1;
        return this.#num[key];
    }
    /**
     * @description 自减
     * @param key 键
     */
    async decr(key) {
        if (!this.#num[key]) {
            this.#num[key] = 0;
        }
        else if (this.checkExpire(key, false)) {
            this.#info[key].expire = -1;
            this.#num[key] = 0;
        }
        this.#num[key] -= 1;
        return this.#num[key];
    }
    /**
     * @description 追加字符串
     * @param key 键
     * @param value 值
     */
    async append(key, value) {
        if (!this.#str[key]) {
            this.#str[key] = '';
        }
        else if (this.checkExpire(key, false)) {
            this.#info[key].expire = -1;
            this.#str[key] = '';
        }
        if (Buffer.isBuffer(value)) {
            this.#str[key] += Buffer.concat([Buffer.from(this.#str[key]), value]).toString();
        }
        else {
            this.#str[key] += value;
        }
        return this.#str[key].length;
    }
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
    async hSet(key, field, value) {
        if (!this.#hash[key]) {
            this.#info[key] = { type: "hash" /* Key.HASH */, expire: -1 };
            this.#hash[key] = {};
        }
        else if (this.checkExpire(key, false)) {
            this.#info[key].expire = -1;
            this.#hash[key] = {};
        }
        this.#hash[key][field] = value;
        return 1;
    }
    /**
     * 获取哈希表字段的值
     * @param key 哈希表的键
     * @param field 哈希表中的字段
     * @returns 返回字段的值，如果字段不存在则返回 null
     */
    async hGet(key, field) {
        if (!this.#hash[key] || !this.#hash[key][field])
            return null;
        if (this.checkExpire(key))
            return null;
        return this.#hash[key][field].toString();
    }
    /**
     * 删除哈希表中的一个或多个字段
     * @param key 哈希表的键
     * @param field 要删除的字段
     * @returns 返回成功删除的字段数量
     */
    async hDel(key, field) {
        if (!this.#hash[key] || !this.#hash[key][field])
            return 0;
        if (this.checkExpire(key))
            return 0;
        delete this.#hash[key][field];
        return 1;
    }
    /**
     * 获取哈希表中所有字段的值
     * @param key 哈希表的键
     * @returns 返回所有字段的值
     */
    async hGetAll(key) {
        if (!this.#hash[key])
            return {};
        if (this.checkExpire(key))
            return {};
        return lodash.mapValues(this.#hash[key], (value) => value.toString());
    }
    /**
     * 将一个或多个值插入到列表的头部
     * @param key 列表的键
     * @param values 要插入的值
     */
    async lPush(key, ...values) {
        if (!this.#list[key]) {
            this.#info[key] = { type: "list" /* Key.LIST */, expire: -1 };
            this.#list[key] = [];
        }
        else if (this.checkExpire(key, false)) {
            this.#info[key].expire = -1;
            this.#list[key] = [];
        }
        this.#list[key].unshift(...values);
        return this.#list[key].length;
    }
    /**
     * 将一个或多个值插入到列表的尾部
     * @param key 列表的键
     * @param values 要插入的值
     */
    async rPush(key, ...values) {
        if (!this.#list[key]) {
            this.#info[key] = { type: "list" /* Key.LIST */, expire: -1 };
            this.#list[key] = [];
        }
        else if (this.checkExpire(key, false)) {
            this.#info[key].expire = -1;
            this.#list[key] = [];
        }
        this.#list[key].push(...values);
        return this.#list[key].length;
    }
    /**
     * 移除并返回列表的第一个元素
     * @param key 列表的键
     * @returns 返回列表的第一个元素，如果列表为空则返回 null
     */
    async lPop(key) {
        if (!this.#list[key] || this.#list[key].length === 0)
            return null;
        if (this.checkExpire(key))
            return null;
        const value = this.#list[key].shift();
        return value ? value.toString() : null;
    }
    /**
     * 移除并返回列表的最后一个元素
     * @param key 列表的键
     * @returns 返回列表的最后一个元素，如果列表为空则返回 null
     */
    async rPop(key) {
        if (!this.#list[key] || this.#list[key].length === 0)
            return null;
        if (this.checkExpire(key))
            return null;
        const value = this.#list[key].pop();
        return value ? value.toString() : null;
    }
    /**
     * 返回列表指定范围内的元素
     * @param key 列表的键
     * @returns 返回列表指定范围内的元素
     */
    async lRange(key, start, stop) {
        if (!this.#list[key])
            return [];
        if (this.checkExpire(key))
            return [];
        return this.#list[key].slice(start, stop + 1).map((value) => value.toString());
    }
    /**
     * 向集合添加一个或多个成员
     * @param key 集合的键
     * @param members 要添加的成员
     * @returns 返回成功添加的成员数量
     */
    async sAdd(key, ...members) {
        if (!this.#set[key]) {
            this.#info[key] = { type: "set" /* Key.SET */, expire: -1 };
            this.#set[key] = new Set();
        }
        else if (this.checkExpire(key, false)) {
            this.#info[key].expire = -1;
            this.#set[key] = new Set();
        }
        let added = 0;
        for (const member of members) {
            if (!this.#set[key].has(member.toString())) {
                this.#set[key].add(member.toString());
                added++;
            }
        }
        return added;
    }
    /**
     * 从集合中移除一个或多个成员
     * @param key 集合的键
     * @param members 要移除的成员
     * @returns 返回成功移除的成员数量
     */
    async sRem(key, ...members) {
        if (!this.#set[key])
            return 0;
        if (this.checkExpire(key))
            return 0;
        let removed = 0;
        for (const member of members) {
            if (this.#set[key].has(member.toString())) {
                this.#set[key].delete(member.toString());
                removed++;
            }
        }
        return removed;
    }
    /**
     * 返回集合的所有成员
     * @param key 集合的键
     * @returns 返回集合的所有成员
     */
    async sMembers(key) {
        if (!this.#set[key])
            return [];
        if (this.checkExpire(key))
            return [];
        const members = Array.from(this.#set[key]);
        return members.map((member) => member.toString());
    }
    /**
     * 检查成员是否是集合的成员
     * @param key 集合的键
     * @param member 要检查的成员
     * @returns 返回 1 表示是集合的成员，0 表示不是集合的成员
     */
    async sismember(key, member) {
        if (!this.#set[key])
            return 0;
        if (this.checkExpire(key))
            return 0;
        return this.#set[key].has(member.toString()) ? 1 : 0;
    }
    /**
     * 向有序集合添加一个或多个成员
     * @param key 有序集合的键
     * @param score 分数
     * @param member 成员
     * @returns 返回成功添加的成员数量
     */
    async zAdd(key, score, member) {
        if (!this.#zset[key]) {
            this.#info[key] = { type: "zset" /* Key.ZSET */, expire: -1 };
            this.#zset[key] = [];
        }
        else if (this.checkExpire(key, false)) {
            this.#info[key].expire = -1;
            this.#zset[key] = [];
        }
        const index = this.#zset[key].findIndex((entry) => entry.member === member.toString());
        if (index === -1) {
            this.#zset[key].push({ score, member });
        }
        else {
            this.#zset[key][index] = { score, member };
        }
        return 1;
    }
    /**
     * 返回有序集合的成员数量
     * @param key 有序集合的键
     * @returns 返回有序集合的成员数量
     */
    async zRange(key, start, stop) {
        if (!this.#list[key])
            return [];
        if (this.checkExpire(key))
            return [];
        const zset = this.#list[key];
        return zset.slice(start, stop + 1).map((entry) => entry.toString());
    }
    /**
     * 从有序集合中移除一个或多个成员
     * @param key 有序集合的键
     * @param members 要移除的成员
     * @returns 返回成功移除的成员数量
     */
    async zRem(key, member) {
        if (!this.#list[key])
            return 0;
        if (this.checkExpire(key))
            return 0;
        const index = this.#list[key].findIndex((entry) => entry === member.toString());
        if (index !== -1) {
            this.#list[key].splice(index, 1);
            return 1;
        }
        return 0;
    }
    /**
     * 返回有序集合的成员数量
     * @param key 有序集合的键
     * @returns 返回有序集合的成员数量
     */
    async zcard(key) {
        if (!this.#list[key])
            return 0;
        if (this.checkExpire(key))
            return 0;
        return this.#list[key].length;
    }
    /**
     * 返回有序集合中指定成员的排名
     * @param key 有序集合的键
     * @param member 成员
     * @returns 返回成员的排名，如果成员不存在则返回 null
     */
    async zRank(key, member) {
        if (!this.#list[key])
            return null;
        if (this.checkExpire(key))
            return null;
        const index = this.#list[key].findIndex((entry) => entry === member.toString());
        return index !== -1 ? index : null;
    }
    /**
     * 返回有序集合中指定成员的分数
     * @param key 有序集合的键
     * @param member 成员
     * @returns 返回成员的分数，如果成员不存在则返回 null
     */
    async zScore(key, member) {
        if (!this.#list[key])
            return null;
        if (this.checkExpire(key))
            return null;
        const entry = this.#list[key].find((entry) => entry === member.toString());
        return entry ? entry.length : null;
    }
    /**
     * 从 HyperLogLog 中添加一个或多个元素
     * @param key HyperLogLog 的键
     * @param elements 要添加的元素
     * @returns 返回 1 表示添加成功，0 表示添加失败
     */
    async pfAdd(key, ...elements) {
        if (!this.#pf[key]) {
            this.#info[key] = { type: "pf" /* Key.PF */, expire: -1 };
            this.#pf[key] = new Set();
        }
        else if (this.checkExpire(key, false)) {
            this.#info[key].expire = -1;
            this.#pf[key] = new Set();
        }
        let added = 0;
        for (const element of elements) {
            if (!this.#pf[key].has(element.toString())) {
                this.#pf[key].add(element.toString());
                added++;
            }
        }
        return added > 0;
    }
    /**
     * 返回 HyperLogLog 的基数估算值
     * @param key HyperLogLog 的键
     * @returns 返回基数估算值
     */
    async pfCount(key) {
        if (!this.#pf[key])
            return 0;
        if (this.checkExpire(key))
            return 0;
        return this.#pf[key].size;
    }
    /**
     * 合并多个 HyperLogLog
     * @param destKey 目标 HyperLogLog 的键
     * @param sourceKeys 源 HyperLogLog 的键
     * @returns 返回 1 表示合并成功，0 表示合并失败
     */
    async pExpire(key, seconds) {
        if (!this.#pf[key])
            return false;
        this.#info[key].expire = moment().add(seconds, 'seconds').valueOf();
        return true;
    }
    /**
     * 设置 HyperLogLog 的过期时间
     * @param key HyperLogLog 的键
     * @param seconds 过期时间（秒）
     * @returns 返回 1 表示设置成功，0 表示设置失败
     */
    async pTTL(key) {
        if (!this.#pf[key])
            return -2;
        if (this.#info[key].expire === -1)
            return -1;
        if (this.checkExpire(key))
            return -2;
        moment(this.#info[key].expire).diff(moment(), 'seconds');
        return 1;
    }
    /**
     * 为键设置到某个特定时间点的过期时间
     * @param key HyperLogLog 的键
     * @param seconds 过期时间（毫秒）
     * @returns 返回布尔值
     */
    async pExpireAt(key, timestamp) {
        if (!this.#pf[key])
            return false;
        if (this.checkExpire(key))
            return false;
        this.#info[key].expire = timestamp;
        return true;
    }
    /**
     * @description 发布消息到频道
     * @param channel 频道
     * @param message 消息
     * @returns 返回订阅者数量
     */
    async publish(channel, message) {
        this.emit(channel, message.toString());
        return this.listenerCount(channel);
    }
    /**
     * @description 订阅一个或多个频道
     * @param channels 频道
     * @param listener 监听器
     * @returns 返回订阅的频道数量
     */
    async subscribe(channels, listener) {
        channels.forEach(channel => this.on(channel, listener));
        return channels.length;
    }
    /**
     * @description 取消订阅一个或多个频道
     * @param channels 频道
     * @param listener 监听器
     * @returns 返回取消订阅的频道数量
     */
    async unsubscribe(channels, listener) {
        channels.forEach(channel => this.off(channel, listener));
        return channels.length;
    }
    /**
     * @description 设置位图指定偏移量的值
     * @param key 键
     * @param offset 偏移量
     * @param value 值
     * @returns 返回设置前的位
     */
    async setBit(key, offset, value) {
        if (!this.#bit[key]) {
            this.#info[key] = { type: "bit" /* Key.BIT */, expire: -1 };
            this.#bit[key] = Buffer.alloc(0);
        }
        else if (this.checkExpire(key, false)) {
            this.#info[key].expire = -1;
            this.#bit[key] = Buffer.alloc(0);
        }
        const byteOffset = Math.floor(offset / 8);
        const bitOffset = offset % 8;
        const oldValue = this.#bit[key].readUInt8(byteOffset);
        const newValue = value ? oldValue | (1 << bitOffset) : oldValue & ~(1 << bitOffset);
        this.#bit[key].writeUInt8(newValue, byteOffset);
        return oldValue;
    }
    /**
     * @description 获取位图指定偏移量的值
     * @param key 键
     * @param offset 偏移量
     * @returns 返回位
     */
    async getBit(key, offset) {
        if (!this.#bit[key])
            return 0;
        if (this.checkExpire(key))
            return 0;
        const byteOffset = Math.floor(offset / 8);
        const bitOffset = offset % 8;
        const value = this.#bit[key].readUInt8(byteOffset);
        return (value & (1 << bitOffset)) ? 1 : 0;
    }
    /**
     * @description 获取位图的指定范围内的位
     * @param key 键
     * @param start 起始偏移量
     * @param end 结束偏移量
     * @returns 返回位数组
     */
    async getRange(key, start, end) {
        if (!this.#bit[key])
            return [];
        if (this.checkExpire(key))
            return [];
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(await this.getBit(key, i));
        }
        return result;
    }
    async save() {
        /** 读取keys 排除掉不是重复项的键 */
        const keys = await this.#level.keys().all();
        const delKeys = keys.filter((key) => !this.#info[key]);
        const list = [];
        delKeys.forEach((key) => list.push({ type: 'del', key }));
        Object.keys(this.#info).forEach((key) => {
            const { type, expire } = this.#info[key];
            const value = this.#str[key];
            list.push({ type: 'put', key, value: JSON.stringify({ type, expire, value }) });
        });
        await this.#level.batch(list);
        return 'OK';
    }
}
