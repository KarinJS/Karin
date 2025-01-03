import fs from 'node:fs';
import path from 'node:path';
import { isTsx } from '@/env';
import { pluginDir as dir, karinDir } from '@root';
import { requireFile, requireFileSync } from '@/utils/fs/require';
import { filesByExt } from '@/utils/fs/path';
/**
 * 缓存
 */
const cache = {
    list: undefined,
    info: undefined,
};
/**
 * 获取插件
 * @param type 获取插件的方式
 * @param isInfo 是否获取插件详细信息 否则返回插件名称列表
 */
export const getPlugins = async (type, isInfo) => {
    if (cache?.list?.[type])
        return cache.list[type];
    if (!cache.list)
        cache.list = {};
    if (!cache.info)
        cache.info = {};
    if (!['npm', 'all', 'git', 'app'].includes(type))
        return [];
    const list = [];
    const files = type === 'npm' ? [] : await fs.promises.readdir(dir, { withFileTypes: true });
    const pluginHandlers = {
        app: () => filterApp(files, list),
        git: () => filterGit(files, list),
        npm: () => filterPkg(list),
        all: async () => {
            await Promise.all([
                filterApp(files, list),
                filterGit(files, list),
                filterPkg(list),
            ]);
        },
    };
    await pluginHandlers[type]();
    cache.list[type] = list;
    setTimeout(() => delete cache?.list?.[type], 60 * 1000);
    if (!isInfo)
        return list;
    const info = await getPluginsInfo(list);
    cache.info[type] = info;
    setTimeout(() => delete cache?.info?.[type], 60 * 1000);
    return info;
};
/**
 * 获取插件详细信息
 * @param list 插件名称列表
 */
const getPluginsInfo = async (list) => {
    const info = [];
    const ext = isTsx() ? ['.ts', '.js'] : ['.js'];
    await Promise.allSettled(list.map(async (v) => {
        const [type, name] = v.split(':');
        if (type === 'app') {
            const file = path.join(dir, name);
            await getAppInfo(info, file, name, ext);
            return;
        }
        if (type === 'git' || type === 'root') {
            const file = path.join(dir, name);
            await getGitInfo(info, file, name, ext);
            return;
        }
        if (type === 'npm') {
            const file = path.join(process.cwd(), 'node_modules', name);
            await getNpmInfo(info, file, name);
        }
    }));
    return info;
};
/**
 * 获取app插件信息
 * @param dir 插件目录
 * @param name 插件名称
 * @param ext 文件后缀
 */
const getAppInfo = async (info, dir, name, ext) => {
    const apps = filesByExt(dir, ext, 'abs').map(v => path.join(dir, v));
    info.push({
        type: 'app',
        name,
        apps,
        dir,
        id: -1,
        pkgPath: path.join(dir, 'package.json'),
        get pkgData() {
            return requireFileSync(this.pkgPath);
        },
    });
};
/**
 * 获取git插件信息
 * @param dir 插件目录
 * @param name 插件名称
 * @param ext 文件后缀
 */
const getGitInfo = async (info, dir, name, ext) => {
    const pkg = await requireFile(path.join(dir, 'package.json'));
    if (!pkg || !pkg.karin) {
        info.push({
            type: 'git',
            name,
            apps: [],
            dir,
            id: -1,
            pkgPath: path.join(dir, 'package.json'),
            get pkgData() {
                return requireFileSync(this.pkgPath);
            },
        });
        return;
    }
    /** app的绝对路径列表 */
    const apps = [];
    /** apps目录列表 */
    const files = [];
    const pushApps = (app) => {
        if (typeof app === 'string') {
            files.push(app);
        }
        else if (Array.isArray(app)) {
            files.push(...app);
        }
    };
    if (isTsx() && pkg.karin['ts-apps']) {
        pushApps(pkg.karin['ts-apps']);
    }
    else if (pkg.karin.apps) {
        pushApps(pkg.karin.apps);
    }
    await Promise.allSettled(files.map(async (app) => {
        const appPath = path.join(dir, app);
        if (!fs.existsSync(appPath))
            return;
        apps.push(...filesByExt(appPath, ext, 'abs').map(v => path.join(appPath, v)));
    }));
    info.push({
        type: 'git',
        name,
        apps,
        dir,
        id: -1,
        pkgPath: path.join(dir, 'package.json'),
        get pkgData() {
            return requireFileSync(this.pkgPath);
        },
    });
};
/**
 * 获取npm插件信息
 * @param dir 插件目录
 * @param name 插件名称
 */
const getNpmInfo = async (info, dir, name) => {
    const ext = '.js';
    const apps = [];
    const pkg = await requireFile(path.join(dir, 'package.json'));
    if (!pkg.karin?.apps?.length) {
        info.push({
            type: 'npm',
            name,
            apps,
            dir,
            id: -1,
            pkgPath: path.join(dir, 'package.json'),
            get pkgData() {
                return requireFileSync(this.pkgPath);
            },
        });
        return;
    }
    const files = [];
    if (typeof pkg.karin.apps === 'string') {
        files.push(pkg.karin.apps);
    }
    else if (Array.isArray(pkg.karin.apps)) {
        files.push(...pkg.karin.apps);
    }
    await Promise.allSettled(files.map(async (app) => {
        const appPath = path.join(dir, app);
        if (!fs.existsSync(appPath))
            return;
        apps.push(...filesByExt(appPath, ext, 'abs').map(v => path.join(appPath, v)));
    }));
    info.push({
        type: 'npm',
        name,
        apps,
        dir,
        id: -1,
        pkgPath: path.join(dir, 'package.json'),
        get pkgData() {
            return requireFileSync(this.pkgPath);
        },
    });
};
/**
 * 判断是否为npm插件
 * @param name pkg名称
 * @returns 是否为pkg插件
 */
export const isNpmPlugin = async (name) => {
    try {
        const file = path.join(process.cwd(), 'node_modules', name, 'package.json');
        const pkg = await requireFile(file);
        return !!pkg.karin;
    }
    catch {
        return false;
    }
};
const filterApp = async (files, list) => {
    await Promise.all(files.map(async (v) => {
        if (!v.isDirectory())
            return;
        if (!v.name.startsWith('karin-plugin-'))
            return;
        if (fs.existsSync(`${dir}/${v.name}/package.json`))
            return;
        list.push(`app:${v.name}`);
    }));
    const root = await requireFile('./package.json');
    if (root.name && root.karin)
        list.push(`root:${root.name}`);
};
const filterGit = async (files, list) => {
    await Promise.all(files.map(async (v) => {
        if (!v.isDirectory())
            return;
        if (!v.name.startsWith('karin-plugin-'))
            return;
        if (!fs.existsSync(path.join(dir, v.name, 'package.json')))
            return;
        list.push(`git:${v.name}`);
    }));
};
const filterPkg = async (list) => {
    const karinPkg = await requireFile(path.join(karinDir, 'package.json'));
    const exclude = [...Object.keys(karinPkg.dependencies), ...Object.keys(karinPkg.devDependencies)];
    const pkg = await requireFile('./package.json');
    const dependencies = Object.keys(pkg.dependencies || {}).filter((name) => !exclude.includes(name) && !name.startsWith('@types'));
    await Promise.all(dependencies.map(async (name) => {
        const isPlugin = await isNpmPlugin(name);
        if (isPlugin)
            list.push(`npm:${name}`);
    }));
};
