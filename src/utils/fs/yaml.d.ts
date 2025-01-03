import YAML from 'yaml';
export type YamlValue = string | boolean | number | object | any[];
export type YamlComment = Record<string, string> | Record<string, {
    comment: string;
    type: 'top' | 'end';
}>;
type Save = {
    /**
     * 保存数据并写入注释 (json文件路径)
     * @param path 保存路径
     * @param value 保存的数据
     * @param commentPath 注释配置文件路径(json文件路径)
     */
    (path: string, value: any, commentPath?: string): void;
    /**
     * 保存数据并写入注释 (键值对)
     * @param path 保存路径
     * @param value 保存的数据
     * @param commentKV 键值对注释配置
     */
    (path: string, value: any, commentKV?: Record<string, string>): void;
    /**
     * 保存数据并写入注释 (javascript对象)
     * @param path 保存路径
     * @param value 保存的数据
     * @param commentJavascript javascript对象注释配置
     */
    (path: string, value: any, commentJavascript?: Record<string, {
        /** 注释类型 */
        type: 'top' | 'end';
        /** 注释内容 */
        comment: string;
    }>): void;
};
/** YAML 编辑器 */
export declare class YamlEditor {
    filePath: string;
    doc: YAML.Document;
    document: YAML.Document;
    constructor(file: string);
    /**
     * 获取指定路径的值
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     */
    get(path: string): any;
    /**
     * 设置指定路径的值
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param value - 要设置的值 允许的类型：`string`, `boolean`, `number`, `object`, `array`
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    set(path: string, value: YamlValue, isSplit?: boolean): boolean;
    /**
     * 向指定路径添加新值
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param value - 要添加的值
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    add(path: string, value: YamlValue, isSplit?: boolean): boolean;
    /**
     * 删除指定路径
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     * @returns 是否删除成功
     */
    del(path: string, isSplit?: boolean): boolean;
    /**
     * 向指定路径的数组添加新值，可以选择添加到数组的开始或结束
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param value - 要添加的值
     * @param prepend - 如果为 true，则添加到数组的开头，否则添加到末尾
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    append(path: string, value: string, prepend?: boolean, isSplit?: boolean): boolean;
    /**
     * 向指定路径的数组删除值
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param value - 要删除的值
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    remove(path: string, value: YamlValue, isSplit?: boolean): boolean;
    /**
     * 检查指定路径的键是否存在
     * @param path - 路径，用点号分隔
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    has(path: string, isSplit?: boolean): boolean;
    /**
     * 查询指定路径中是否包含指定的值
     * @param path - 路径，用点号分隔
     * @param value - 要查询的值
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    hasval(path: string, value: YamlValue, isSplit?: boolean): boolean;
    /**
     * 查询指定路径中是否包含指定的值
     * @param path - 路径，用点号分隔
     * @param value - 要查询的值
     * @deprecated 请使用 `hasval` 代替
     */
    hasVal(path: string, value: YamlValue): boolean;
    /**
     * 向根节点新增元素，如果根节点不是数组，则将其转换为数组再新增元素
     * @param value - 要新增的元素
     */
    pusharr(value: YamlValue): boolean;
    /**
     * 根据索引从根节点数组删除元素
     * @param index - 要删除元素的索引
     */
    delarr(index: number): boolean;
    /**
     * 获取指定路径的pair对象
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    getpair(path: string, isSplit?: boolean): any;
    /**
     * 设置指定键的注释
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param comment - 要设置的注释
     * @param prepend - 如果为 true，则添加注释到开头，否则添加到同一行的末尾
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    comment(path: string, comment: string, prepend?: boolean, isSplit?: boolean): void;
    /**
     * 删除指定键的注释
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param type - 要删除的注释类型，`before` 为注释前，`after` 为注释后，`all` 为全部
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    uncomment(path: string, type?: 'before' | 'after' | 'all', isSplit?: boolean): void;
    /**
     * 检查注释是否存在
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param type - 要检查的注释类型，`before` 为注释前，`after` 为注释后
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    hascomment(path: string, type: 'before' | 'after', isSplit?: boolean): boolean;
    /**
     * 获取指定键的注释
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    getcomment(path: string, isSplit?: boolean): any;
    /**
     * 保存文件
     * 保存失败会抛出异常
     */
    save(): void;
}
interface ReadFunction {
    (path: string): any;
    /**
     * 保存数据并写入注释
     * @param options utf-8编码的字符串或注释配置对象
     */
    save?: (options?: string | YamlComment) => boolean;
}
/**
 * 读取并解析 yaml 文件
 * @param path yaml 文件路径
 * @returns 解析后的数据
 */
export declare const read: ReadFunction;
/**
 * 写入 YAML 文件
 * @param path 文件路径
 * @param value 数据
 */
export declare const write: (path: string, value: any) => boolean;
/**
 * 保存数据并写入注释
 * @param path 文件路径
 * @param value 数据 仅支持 JavaScript 对象
 * @param options 注释配置
 */
export declare const save: Save;
/**
 * 为指定文件写入注释
 * @param filePath 文件路径
 * @param commentConfig 注释配置文件路径或 JSON 对象
 */
export declare const comment: (filePath: string, commentConfig: string | YamlComment) => void;
/**
 * 批量添加注释
 * @param editor YamlEditor 实例
 * @param comments 注释配置对象
 */
export declare const applyComments: (editor: YamlEditor, comments: YamlComment) => void;
/** YAML 工具 */
export declare const yaml: typeof YAML & {
    /** 读取并解析 YAML 文件 */
    read: ReadFunction;
    /** 保存数据并写入注释 */
    save: Save;
    /** 为指定文件写入注释 */
    comment: (filePath: string, commentConfig: string | YamlComment) => void;
    /** 批量添加注释 */
    applyComments: (editor: YamlEditor, comments: YamlComment) => void;
};
export {};
