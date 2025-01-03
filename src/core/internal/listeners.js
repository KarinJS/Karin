// TODO: 此文件存在内存泄漏 可能是无限循环引用导致的
import { EventEmitter } from 'events';
// & { [key in K]: (event: OtherTypes[key]) => void }
/** 类型化事件监听器 */
export class TypedListeners extends EventEmitter {
    /**
     * 注册事件监听器
     * @param event 事件名称
     * @param listener 监听器函数
     */
    on(event, listener) {
        return super.on(event, listener);
    }
    /**
     * 注册一次性事件监听器
     * @param event 事件名称
     * @param listener 监听器函数
     */
    once(event, listener) {
        return super.once(event, listener);
    }
    /**
     * 移除事件监听器
     * @param event 事件名称
     * @param listener 监听器函数
     */
    off(event, listener) {
        return super.off(event, listener);
    }
    /**
     * 触发事件
     * @param event 事件名称
     * @param args 事件参数
     */
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    /**
     * 获取事件监听器列表
     * @param event 事件名称
     */
    listeners(event) {
        return super.listeners(event);
    }
    /**
     * 移除所有事件监听器
     * @param event 事件名称
     * @returns this
     */
    removeAllListeners(event) {
        super.removeAllListeners(event);
        return this;
    }
    /**
     * 设置最大监听器数量
     * @param n 最大监听器数量
     * @returns this
     */
    setMaxListeners(n) {
        super.setMaxListeners(n);
        return this;
    }
    /**
     * 获取最大监听器数量
     * @returns 最大监听器数量
     */
    getMaxListeners() {
        return super.getMaxListeners();
    }
    /**
     * 添加事件监听器
     * @param event 事件名称
     * @param listener 监听器函数
     */
    addListener(event, listener) {
        return super.addListener(event, listener);
    }
    /**
     * 获取事件监听器数量
     * @param event 事件名称
     * @returns 监听器数量
     */
    listenerCount(event) {
        return super.listenerCount(event);
    }
    /**
     * 返回已注册的事件名称数组
     * @param event 事件名称
     * @returns 监听器数量
     */
    eventNames() {
        return super.eventNames();
    }
    /**
     * 返回指定事件的原始监听器数组（包括一次性监听器）
     * @param event 事件名称
     * @returns 监听器数量
     */
    rawListeners(event) {
        return super.rawListeners(event);
    }
    /**
     * 为指定事件添加监听器，但将其添加到监听器数组的开头
     * @param event 事件名称
     * @returns 监听器数量
     */
    prependListener(event, listener) {
        return super.prependListener(event, listener);
    }
    /**
     *  为指定事件添加一次性监听器，并将其添加到监听器数组的开头
     * @param event 事件名称
     * @returns 监听器数量
     */
    prependOnceListener(event, listener) {
        return super.prependOnceListener(event, listener);
    }
    /**
     * 移除事件监听器
     * @param event 事件名称
     * @param listener 监听器函数
     */
    removeListener(event, listener) {
        return super.removeListener(event, listener);
    }
}
/**
 * @internal
 * @description 内部事件监听器
 */
export const listeners = new TypedListeners();
