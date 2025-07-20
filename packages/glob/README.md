# @karin/glob

增强的 glob 模块，提供动态导入、原始内容读取和文件处理功能。

## 安装

```bash
# 使用 pnpm
pnpm add @karin/glob

# 使用 npm
npm install @karin/glob

# 使用 yarn
yarn add @karin/glob
```

## 基本用法

### 动态导入文件

```typescript
import { importGlob } from '@karin/glob';

/** 返回值为 [动态导入函数对象, 原始内容函数对象, 路径获取函数] */
const [modules, raw, paths] = await importGlob('./src/**/*.ts');

/** 使用动态导入 */
const module = await modules['./src/utils/helper.ts']();

/** 获取所有匹配的路径 */
const allPaths = paths();
```

### 立即导入文件

```typescript
import { importGlobEager } from '@karin/glob';

/** 返回值为 [已导入模块对象, 错误对象] */
const [modules, errors] = await importGlobEager('./src/**/*.ts');

/** 直接使用导入的模块 */
const helper = modules['./src/utils/helper.ts'];
```

## 高级选项

### 导入选项

```typescript
/** 导入默认导出 */
const [modules] = await importGlob('./src/**/*.ts', { 
  import: 'default' 
});

/** 导入命名导出 */
const [modules] = await importGlob('./src/**/*.ts', { 
  import: 'namedExport' 
});
```

### 获取原始内容

```typescript
const [_, raw] = await importGlob('./src/**/*.ts', { 
  raw: true 
});

/** 获取文件原始内容 */
const content = raw['./src/utils/helper.ts']();
```

### 使用绝对路径

```typescript
const [modules] = await importGlob('./src/**/*.ts', { 
  absPath: true 
});

/** 结果将使用绝对路径作为键 */
```

### 自定义工作目录

```typescript
const [modules] = await importGlob('./src/**/*.ts', { 
  cwd: '/custom/path' 
});
```

## 插件系统

@karin/glob 支持插件系统，允许您自定义文件处理逻辑。

### 文件匹配钩子

```typescript
const [modules] = await importGlob('./src/**/*.ts', {
  matchHook: (file) => {
    /** 忽略测试文件 */
    if (file.includes('.test.')) {
      return false;
    }
    
    /** 重映射路径 */
    if (file.includes('/old/')) {
      return file.replace('/old/', '/new/');
    }
    
    /** 保持原路径 */
    return;
  }
});
```

### 异步文件匹配钩子

```typescript
import fs from 'node:fs/promises';

const [modules] = await importGlob('./src/**/*.ts', {
  matchHook: async (file) => {
    /** 基于文件内容进行过滤 */
    const content = await fs.readFile(file, 'utf-8');
    if (content.includes('PRIVATE')) {
      return false;
    }
    return;
  }
});
```

所有钩子并发执行，提高处理效率。

更多关于插件系统的详细信息，请参阅 [插件文档](./docs/plugins.md)。

## API 参考

### importGlob

```typescript
function importGlob<T = unknown>(
  target: string | string[],
  options?: GlobOptions
): Promise<GlobResult<T>>;

type GlobResult<T> = [
  Record<string, () => Promise<T>>,
  Record<string, () => string>,
  (isAbsPath?: boolean) => string[]
];
```

### importGlobEager

```typescript
function importGlobEager<T = unknown>(
  target: string | string[],
  options?: Omit<GlobOptions, 'raw'>
): Promise<GlobResultEager<T>>;

type GlobResultEager<T> = [
  Record<string, T>,
  Record<string, unknown>
];
```

### GlobOptions

```typescript
interface GlobOptions extends GlobOptionsType {
  /** 工作目录 */
  cwd?: string;
  
  /** 
   * 返回的import结果
   * 'default' | string
   */
  import?: 'default' | string;
  
  /** 返回原始文件内容 */
  raw?: boolean;
  
  /** 返回绝对路径 */
  absPath?: boolean;
  
  /** 
   * 文件匹配钩子
   * 返回 false 忽略文件，返回字符串替换路径，返回 true/undefined 保持原路径
   * 支持异步操作，可以返回 Promise
   */
  matchHook?: (file: string) => unknown | Promise<unknown>;
}
```

## 许可证

MIT 