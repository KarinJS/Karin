/**
 * 创建日志方法
 * @param enable 是否启用
 * @param isBot 是否为bot
 */
export const createLogger = (enable, isBot) => {
    if (isBot) {
        const fnc = enable === false
            ? (id, log) => logger.bot('debug', id, log)
            : (id, log) => logger.bot('mark', id, log);
        return fnc;
    }
    return enable === false
        ? (log) => logger.debug(log)
        : (log) => logger.mark(log);
};
/**
 * 创建插件文件对象
 * @param type - 文件类型
 */
export const createFile = (type, name) => {
    return {
        absPath: '',
        basename: '',
        dirname: '',
        method: '',
        type,
        name,
    };
};
/**
 * 创建插件pkg对象
 */
export const createPkg = () => {
    return {
        name: '',
        apps: [],
        dir: '',
        id: -1,
        pkgData: {},
        pkgPath: '',
        type: 'app',
    };
};
