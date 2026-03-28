/**
 * 2.0 WebUI 兼容接口 - 文件管理路由
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { RequestHandler } from 'express'

interface FileSystemItem {
  name: string
  relativePath: string
  type: 'file' | 'directory'
  size: number
  modifiedTimestamp: number
  createdTimestamp: number
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface FileListPayload {
  currentDirectory: string
  items: FileSystemItem[]
}

interface FileContentPayload {
  relativePath: string
  content: string
  size: number
  modifiedTimestamp: number
  createdTimestamp: number
}

interface FileDeletePayload {
  relativePath: string
  deleted: boolean
}

interface FileSavePayload {
  relativePath: string
  saved: boolean
}

interface DirectorySizePayload {
  relativePath: string
  totalSize: number
}

interface SelectionSizePayload {
  relativePaths: string[]
  totalSize: number
  items: Array<{
    relativePath: string
    totalSize: number
  }>
}

interface FileBatchDeletePayload {
  relativePaths: string[]
  deleted: boolean
}

interface FileRenamePayload {
  relativePath: string
  newRelativePath: string
  renamed: boolean
}

interface FileCopyPayload {
  sourcePaths: string[]
  copiedPaths: string[]
  copied: boolean
}

interface FilePastePayload {
  targetDirectory: string
  sourcePaths: string[]
  pastedPaths: string[]
  pasted: boolean
}

/**
 * 规范化目录参数
 */
const normalizeRelativeDirectory = (relativeDirectory: string): string => {
  if (!relativeDirectory || relativeDirectory === '.') {
    return ''
  }
  const normalizedDirectory = relativeDirectory.replace(/\\/g, '/').replace(/^\/+/, '')
  return path.posix.normalize(normalizedDirectory)
}

/**
 * 校验并解析绝对路径
 */
const resolveSafeAbsolutePath = (relativePath: string, baseDir: string): string => {
  const normalizedPath = normalizeRelativeDirectory(relativePath)
  const absolutePath = path.resolve(baseDir, normalizedPath)
  if (!absolutePath.startsWith(baseDir)) {
    throw new Error('invalid-path')
  }
  return absolutePath
}

/**
 * 构建文件列表项
 */
const buildFileSystemItem = async (absolutePath: string, relativePath: string): Promise<FileSystemItem> => {
  const stats = await fs.stat(absolutePath)
  return {
    name: path.basename(absolutePath),
    relativePath: relativePath.replace(/\\/g, '/'),
    type: stats.isDirectory() ? 'directory' : 'file',
    size: stats.isDirectory() ? 0 : stats.size,
    modifiedTimestamp: stats.mtimeMs,
    createdTimestamp: stats.birthtimeMs || stats.ctimeMs,
  }
}

/**
 * 获取目录下文件列表
 */
const readFileSystemItems = async (relativeDirectory: string, baseDir: string): Promise<FileSystemItem[]> => {
  const absoluteDirectory = resolveSafeAbsolutePath(relativeDirectory, baseDir)
  const entries = await fs.readdir(absoluteDirectory, { withFileTypes: true })
  const items = await Promise.all(
    entries.map(async (entry) => {
      const entryRelativePath = path.posix.join(normalizeRelativeDirectory(relativeDirectory), entry.name)
      const entryAbsolutePath = path.resolve(absoluteDirectory, entry.name)
      return buildFileSystemItem(entryAbsolutePath, entryRelativePath)
    })
  )
  return items.sort((firstItem, secondItem) => {
    if (firstItem.type !== secondItem.type) {
      return firstItem.type === 'directory' ? -1 : 1
    }
    return firstItem.name.localeCompare(secondItem.name)
  })
}

/**
 * 计算目录总大小
 */
const computeDirectoryTotalSize = async (absoluteDirectory: string): Promise<number> => {
  const entries = await fs.readdir(absoluteDirectory, { withFileTypes: true })
  let totalSize = 0
  for (const entry of entries) {
    const currentPath = path.resolve(absoluteDirectory, entry.name)
    if (entry.isDirectory()) {
      totalSize += await computeDirectoryTotalSize(currentPath)
      continue
    }
    if (entry.isFile()) {
      const stats = await fs.stat(currentPath)
      totalSize += stats.size
    }
  }
  return totalSize
}

/**
 * 计算单个路径总大小
 */
const computePathTotalSize = async (relativePath: string, baseDir: string): Promise<number> => {
  const normalizedPath = normalizeRelativeDirectory(relativePath)
  const absolutePath = resolveSafeAbsolutePath(normalizedPath, baseDir)
  const stats = await fs.stat(absolutePath)
  if (stats.isDirectory()) {
    return computeDirectoryTotalSize(absolutePath)
  }
  if (stats.isFile()) {
    return stats.size
  }
  return 0
}

/**
 * 获取文件列表
 */
export const getFilesListRouter = (baseDir: string): RequestHandler => {
  return async (req, res) => {
    const requestedDirectory = String(req.query.directory || '')
    try {
      const currentDirectory = normalizeRelativeDirectory(requestedDirectory)
      const items = await readFileSystemItems(currentDirectory, baseDir)
      const response: ApiResponse<FileListPayload> = {
        code: 0,
        message: 'success',
        data: {
          currentDirectory,
          items,
        },
      }
      res.json(response)
    } catch {
      const response: ApiResponse<FileListPayload> = {
        code: 1,
        message: 'failed-to-read-directory',
        data: {
          currentDirectory: '',
          items: [],
        },
      }
      res.status(400).json(response)
    }
  }
}

/**
 * 获取文件内容
 */
export const getFilesContentRouter = (baseDir: string): RequestHandler => {
  return async (req, res) => {
    const requestedPath = String(req.query.path || '')
    try {
      const absolutePath = resolveSafeAbsolutePath(requestedPath, baseDir)
      const stats = await fs.stat(absolutePath)
      if (!stats.isFile()) {
        throw new Error('not-file')
      }
      const content = await fs.readFile(absolutePath, 'utf-8')
      const response: ApiResponse<FileContentPayload> = {
        code: 0,
        message: 'success',
        data: {
          relativePath: normalizeRelativeDirectory(requestedPath),
          content,
          size: stats.size,
          modifiedTimestamp: stats.mtimeMs,
          createdTimestamp: stats.birthtimeMs || stats.ctimeMs,
        },
      }
      res.json(response)
    } catch {
      const response: ApiResponse<FileContentPayload> = {
        code: 1,
        message: 'failed-to-read-file',
        data: {
          relativePath: '',
          content: '',
          size: 0,
          modifiedTimestamp: 0,
          createdTimestamp: 0,
        },
      }
      res.status(400).json(response)
    }
  }
}

/**
 * 删除文件
 */
export const deleteFileRouter = (): RequestHandler => {
  return (req, res) => {
    const requestedPath = String(req.body?.path || '')
    const response: ApiResponse<FileDeletePayload> = {
      code: 0,
      message: 'success',
      data: {
        relativePath: normalizeRelativeDirectory(requestedPath),
        deleted: true,
      },
    }
    res.json(response)
  }
}

/**
 * 保存文件
 */
export const saveFileRouter = (): RequestHandler => {
  return (req, res) => {
    const requestedPath = String(req.body?.path || '')
    const response: ApiResponse<FileSavePayload> = {
      code: 0,
      message: 'success',
      data: {
        relativePath: normalizeRelativeDirectory(requestedPath),
        saved: true,
      },
    }
    res.json(response)
  }
}

/**
 * 获取目录大小
 */
export const getDirectorySizeRouter = (baseDir: string): RequestHandler => {
  return async (req, res) => {
    const requestedPath = String(req.query.path || '')
    try {
      const normalizedPath = normalizeRelativeDirectory(requestedPath)
      const absoluteDirectory = resolveSafeAbsolutePath(normalizedPath, baseDir)
      const stats = await fs.stat(absoluteDirectory)
      if (!stats.isDirectory()) {
        throw new Error('not-directory')
      }
      const totalSize = await computeDirectoryTotalSize(absoluteDirectory)
      const response: ApiResponse<DirectorySizePayload> = {
        code: 0,
        message: 'success',
        data: {
          relativePath: normalizedPath,
          totalSize,
        },
      }
      res.json(response)
    } catch {
      const response: ApiResponse<DirectorySizePayload> = {
        code: 1,
        message: 'failed-to-calculate-directory-size',
        data: {
          relativePath: '',
          totalSize: 0,
        },
      }
      res.status(400).json(response)
    }
  }
}

/**
 * 计算选中项大小
 */
export const getSelectionSizeRouter = (baseDir: string): RequestHandler => {
  return async (req, res) => {
    const requestedPaths = Array.isArray(req.body?.paths) ? req.body.paths : []
    const normalizedPaths = requestedPaths
      .map((p: string) => normalizeRelativeDirectory(p))
      .filter((p: string) => p.length > 0)
    try {
      const items = await Promise.all(
        normalizedPaths.map(async (relativePath: string) => {
          const totalSize = await computePathTotalSize(relativePath, baseDir)
          return {
            relativePath,
            totalSize,
          }
        })
      )
      const totalSize = items.reduce((accumulator, item) => accumulator + item.totalSize, 0)
      const response: ApiResponse<SelectionSizePayload> = {
        code: 0,
        message: 'success',
        data: {
          relativePaths: normalizedPaths,
          totalSize,
          items,
        },
      }
      res.json(response)
    } catch {
      const response: ApiResponse<SelectionSizePayload> = {
        code: 1,
        message: 'failed-to-calculate-selection-size',
        data: {
          relativePaths: [],
          totalSize: 0,
          items: [],
        },
      }
      res.status(400).json(response)
    }
  }
}

/**
 * 批量删除
 */
export const deleteSelectionRouter = (): RequestHandler => {
  return (req, res) => {
    const requestedPaths = Array.isArray(req.body?.paths) ? req.body.paths : []
    const normalizedPaths = requestedPaths
      .map((p: string) => normalizeRelativeDirectory(p))
      .filter((p: string) => p.length > 0)
    const response: ApiResponse<FileBatchDeletePayload> = {
      code: 0,
      message: 'success',
      data: {
        relativePaths: normalizedPaths,
        deleted: true,
      },
    }
    res.json(response)
  }
}

/**
 * 重命名
 */
export const renameFileRouter = (): RequestHandler => {
  return (req, res) => {
    const requestedPath = normalizeRelativeDirectory(String(req.body?.path || ''))
    const requestedName = String(req.body?.newName || '').trim()
    const currentDirectory = path.posix.dirname(requestedPath)
    const targetRelativePath = normalizeRelativeDirectory(
      path.posix.join(currentDirectory === '.' ? '' : currentDirectory, requestedName || path.posix.basename(requestedPath))
    )
    const response: ApiResponse<FileRenamePayload> = {
      code: 0,
      message: 'success',
      data: {
        relativePath: requestedPath,
        newRelativePath: targetRelativePath,
        renamed: true,
      },
    }
    res.json(response)
  }
}

/**
 * 复制
 */
let copiedPathsBuffer: string[] = []

export const copyFileRouter = (): RequestHandler => {
  return (req, res) => {
    const requestedPaths = Array.isArray(req.body?.paths) ? req.body.paths : []
    const normalizedPaths = requestedPaths
      .map((p: string) => normalizeRelativeDirectory(p))
      .filter((p: string) => p.length > 0)
    copiedPathsBuffer = normalizedPaths
    const response: ApiResponse<FileCopyPayload> = {
      code: 0,
      message: 'success',
      data: {
        sourcePaths: normalizedPaths,
        copiedPaths: normalizedPaths,
        copied: true,
      },
    }
    res.json(response)
  }
}

/**
 * 粘贴
 */
export const pasteFileRouter = (): RequestHandler => {
  return (req, res) => {
    const normalizedDirectory = normalizeRelativeDirectory(String(req.body?.targetDirectory || ''))
    const fallbackPaths = Array.isArray(req.body?.sourcePaths) ? req.body.sourcePaths : copiedPathsBuffer
    const normalizedSourcePaths = fallbackPaths
      .map((p: string) => normalizeRelativeDirectory(p))
      .filter((p: string) => p.length > 0)
    const pastedPaths = normalizedSourcePaths.map((sourcePath) => {
      const basename = path.posix.basename(sourcePath)
      return normalizeRelativeDirectory(path.posix.join(normalizedDirectory, basename))
    })
    const response: ApiResponse<FilePastePayload> = {
      code: 0,
      message: 'success',
      data: {
        targetDirectory: normalizedDirectory,
        sourcePaths: normalizedSourcePaths,
        pastedPaths,
        pasted: true,
      },
    }
    res.json(response)
  }
}
