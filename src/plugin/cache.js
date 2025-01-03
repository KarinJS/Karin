/** 缓存 */
export const cache = {
    index: {},
    accept: [],
    command: [],
    task: [],
    button: [],
    handler: {},
    missing: new Map(),
    watcher: new Map(),
    count: {
        accept: 0,
        command: 0,
        task: 0,
        button: 0,
        handler: {
            key: 0,
            fnc: 0,
        },
    },
    static: [],
};
