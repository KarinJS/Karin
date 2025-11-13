/**
 * Deprecated APIs - Backward Compatibility Layer
 *
 * 此文件提供向后兼容的旧版 API 映射到新版 API
 * 所有旧 API 都标记为 @deprecated，建议迁移到新版 API
 *
 * @module deprecated
 * @deprecated 使用新版模块化 API 代替
 */

// ============================================================================
// fs 模块 - 文件系统操作
// ============================================================================

/**
 * @deprecated 使用 `ensureDir()` 代替
 * @see {@link ensureDir}
 */
export { ensureDir as existToMkdir } from './fs'

/**
 * @deprecated 使用 `readDirRecursive()` 代替
 * @see {@link readDirRecursive}
 */
export { readDirRecursive as getAllFiles } from './fs'

/**
 * @deprecated 使用 `readDirRecursiveSync()` 代替
 * @see {@link readDirRecursiveSync}
 */
export { readDirRecursiveSync as getAllFilesSync } from './fs'

// ============================================================================
// path 模块 - 路径处理
// ============================================================================

/**
 * @deprecated 使用 `path.resolve()` 代替
 * @see {@link resolve}
 */
export { resolve as absPath } from './path'

/**
 * @deprecated 使用 `path.format()` 代替
 * @see {@link format}
 */
export { format as formatPath } from './path'

/**
 * @deprecated 使用 `path.relative()` 代替
 * @see {@link relative}
 */
export { relative as getRelPath } from './path'

/**
 * @deprecated 使用 `path.isEqual()` 代替
 * @see {@link isEqual}
 */
export { isEqual as isPathEqual } from './path'

/**
 * @deprecated 使用 `path.findByExt()` 代替
 * @see {@link findByExt}
 */
export { findByExt as filesByExt } from './path'

/**
 * @deprecated 使用 `path.findDirs()` 代替
 * @see {@link findDirs}
 */
export { findDirs as getDirs } from './path'

/**
 * @deprecated 使用 `path.findDirsSync()` 代替
 * @see {@link findDirsSync}
 */
export { findDirsSync as getDirsSync } from './path'

// ============================================================================
// file 模块 - 文件操作
// ============================================================================

/**
 * @deprecated 使用 `download()` 代替
 * @see {@link download}
 */
export { download as downloadFile } from './file'

/**
 * @deprecated 使用 `download()` 代替
 * @see {@link download}
 */
export { download as downFile } from './file'

// ============================================================================
// module 模块 - 动态模块加载
// ============================================================================

/**
 * @deprecated 使用 `imports()` 代替（注意：函数名已更改以避免关键字冲突）
 * @see {@link imports}
 */
export { imports } from './module'

/**
 * @deprecated 使用 `importWithStatus()` 代替，获取带状态的导入结果
 * @see {@link importWithStatus}
 */
export { importWithStatus } from './module'

// ============================================================================
// network 模块 - 网络操作
// ============================================================================

/**
 * @deprecated 使用 `isIPv4Loopback()` 代替
 * @see {@link isIPv4Loopback}
 */
export { isIPv4Loopback as isIPv4Loop } from './network'

/**
 * @deprecated 使用 `isIPv6Loopback()` 代替
 * @see {@link isIPv6Loopback}
 */
export { isIPv6Loopback as isIPv6Loop } from './network'

// ============================================================================
// time 模块 - 时间工具
// ============================================================================

/**
 * @deprecated 使用 `formatTimeDiff()` 代替
 * @see {@link formatTimeDiff}
 */
export { formatTimeDiff as formatTime } from './time'

/**
 * @deprecated 使用 `getUptime()` 代替
 * @see {@link getUptime}
 */
export { getUptime as uptime } from './time'

// ============================================================================
// crypto 模块 - 加密工具
// ============================================================================

/**
 * @deprecated 使用 `generateSecret()` 或 `authKey()` 代替
 * @see {@link generateSecret}
 */
export { generateSecret as secretKey } from './crypto'

// ============================================================================
// 说明
// ============================================================================

/**
 * 迁移指南：
 *
 * 1. 旧版 API（直接导入）：
 *    ```typescript
 *    import { existToMkdir, getAllFiles } from '@karinjs/utils'
 *    ```
 *
 * 2. 新版 API（模块化导入）：
 *    ```typescript
 *    import { fs } from '@karinjs/utils'
 *    fs.ensureDir()
 *    fs.readDirRecursive()
 *    ```
 *
 * 3. 新版 API（直接导入）：
 *    ```typescript
 *    import { ensureDir, readDirRecursive } from '@karinjs/utils'
 *    ```
 *
 * 详细迁移指南请参考：MIGRATION_GUIDE.md
 */
