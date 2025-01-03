import { randomUUID } from 'node:crypto';
/**
 * @description 存储原始函数的 Map
 */
const fnStore = new Map();
/**
 * @description 锁定对象的方法，使其不可被调用
 * @param obj 对象
 * @param key 方法名
 * @param msg 锁定时抛出的错误信息
 * @returns 唯一标识符 用于解锁
 */
export const lockMethod = (obj, key, msg = `方法 ${String(key)} 已被锁定`) => {
    if (typeof obj[key] !== 'function') {
        throw new Error(`属性 ${String(key)} 不是一个函数`);
    }
    /** 唯一标识符 用于解锁 */
    const storeKey = randomUUID();
    /** 保存原有函数 */
    fnStore.set(storeKey, { key: String(key), fnc: obj[key] });
    /** 替换为锁定的函数 */
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        value: () => {
            throw Error(msg);
        },
    });
    return () => unlockMethod(obj, storeKey);
};
/**
 * @description 解锁对象的方法，恢复其原有功能
 * @param obj 对象
 * @param storeKey 唯一标识符
 * @returns 解锁结果
 */
const unlockMethod = (obj, storeKey) => {
    const data = fnStore.get(storeKey);
    if (!data) {
        return { status: false, msg: `未找到被锁定的方法 ${String(storeKey)}` };
    }
    const { key, fnc } = data;
    if (typeof fnc !== 'function') {
        return { status: false, msg: `属性 ${String(key)} 不是一个函数` };
    }
    /** 恢复原始函数 */
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        value: fnc.bind(obj),
    });
    /** 清理存储 */
    fnStore.delete(storeKey);
    return { status: true, msg: `解锁方法 ${String(key)} 成功` };
};
/**
 * @description 锁定对象的属性，使其不可被修改
 * @param obj 对象
 * @param key 属性
 */
export const lockProp = (obj, key) => {
    /** 获取属性描述符 */
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (descriptor) {
        Object.defineProperty(obj, key, {
            /** 属性是否可枚举 */
            enumerable: true,
            /** 属性描述符是否可配置 */
            configurable: false,
            /** 属性是否可写  */
            writable: false,
            /** 保持原有的值 */
            value: descriptor.value,
        });
    }
    else {
        throw new Error(`Property ${String(key)} does not exist on the object`);
    }
};
/**
 * @description `锁定属性` `锁定方法` `解锁方法`
 */
export const lock = {
    /** 锁定属性 */
    prop: lockProp,
    /** 锁定方法 */
    method: lockMethod,
};
