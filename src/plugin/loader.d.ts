/**
 * 插件加载
 * @description 插件加载
 * @class LoaderPlugin
 */
export declare class LoaderPlugin {
    /**
     * @description 初始化插件
     */
    init(): Promise<void>;
    /**
     * @description 热更新收集
     */
    /**
     * 处理导入的模块
     * @param app app文件绝对路径
     * @param type 插件类型
     * @param method 插件方法名称
     */
    private createFile;
    /**
     * 导入插件
     * @param name 插件包名称 `karin-plugin-example`
     * @param app 插件文件绝对路径 `/root/karin/plugins/karin-plugin-example/index.js`
     * @param isRefresh 是否加载新模块
     */
    private importApp;
    /**
     * 加载入口文件
     * @param name 插件名称
     * @param file 入口文件
     * @param isRefresh 是否刷新
     */
    private loaderMain;
    /**
     * 判断是否为指定类型
     * @param val 插件方法
     * @param type 插件类型
     */
    private isType;
    /**
     * 缓存插件
     * @param result 插件导入结果
     * @param info 插件信息
     */
    private cachePlugin;
    /**
     * 缓存类命令插件
     * @param result 插件导入结果
     * @param info 插件信息
     * @param pkg 插件包信息
     * @param app app文件绝对路径
     * @param key 插件方法名称
     */
    private cacheClassPlugin;
    /**
     * 排序
     */
    private sort;
}
