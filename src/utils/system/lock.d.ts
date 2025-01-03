/**
 * @description 锁定对象的方法，使其不可被调用
 * @param obj 对象
 * @param key 方法名
 * @param msg 锁定时抛出的错误信息
 * @returns 唯一标识符 用于解锁
 */
export declare const lockMethod: <T extends object, K extends keyof T>(obj: T, key: K, msg?: string) => () => {
    status: boolean;
    msg: string;
};
/**
 * @description 锁定对象的属性，使其不可被修改
 * @param obj 对象
 * @param key 属性
 */
export declare const lockProp: <T extends object, K extends keyof T>(obj: T, key: K) => void;
/**
 * @description `锁定属性` `锁定方法` `解锁方法`
 */
export declare const lock: {
    /** 锁定属性 */
    prop: <T extends object, K extends keyof T>(obj: T, key: K) => void;
    /** 锁定方法 */
    method: <T extends object, K extends keyof T>(obj: T, key: K, msg?: string) => () => {
        status: boolean;
        msg: string;
    };
};
