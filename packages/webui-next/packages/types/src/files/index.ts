/**
 * 文件系统条目类型。
 */
export type FileSystemItemType = 'file' | 'directory';

/**
 * 文件浏览器返回的文件系统项。
 */
export interface FileSystemItem {
  /**
   * 文件或目录名称。
   */
  name: string;
  /**
   * 相对于受管理根目录的相对路径。
   */
  relativePath: string;
  /**
   * 条目类型。
   */
  type: FileSystemItemType;
  /**
   * 文件大小，单位为字节。目录可使用 `0`。
   */
  size: number;
  /**
   * 最后修改时间戳，单位为毫秒。
   */
  modifiedTimestamp: number;
  /**
   * 创建时间戳，单位为毫秒。
   */
  createdTimestamp: number;
}

/**
 * 用于列出目录的请求查询。
 */
export interface FileListRequest {
  /**
   * 相对目录路径。
   */
  directory?: string;
}

/**
 * 文件列表负载。
 */
export interface FileListPayload {
  /**
   * 当前目录路径。
   */
  currentDirectory: string;
  /**
   * 目录下的项目。
   */
  items: FileSystemItem[];
}

/**
 * 用于读取文件的请求查询。
 */
export interface FileContentRequest {
  /**
   * 相对文件路径。
   */
  path: string;
  /**
   * 后端是否应返回原始文件响应。
   */
  raw?: boolean;
}

/**
 * 文件内容负载。
 */
export interface FileContentPayload {
  /**
   * 相对文件路径。
   */
  relativePath: string;
  /**
   * 文件文本内容。
   */
  content: string;
  /**
   * 文件大小，单位为字节。
   */
  size: number;
  /**
   * 最后修改时间戳，单位为毫秒。
   */
  modifiedTimestamp: number;
  /**
   * 创建时间戳，单位为毫秒。
   */
  createdTimestamp: number;
}

/**
 * 用于删除单一路径的请求体。
 */
export interface FileDeleteRequest {
  /**
   * 相对文件或目录路径。
   */
  path: string;
}

/**
 * 单一删除结果负载。
 */
export interface FileDeletePayload {
  /**
   * 已删除的相对路径。
   */
  relativePath: string;
  /**
   * 删除是否成功。
   */
  deleted: boolean;
}

/**
 * 用于保存文件的请求体。
 */
export interface FileSaveRequest {
  /**
   * 相对文件路径。
   */
  path: string;
  /**
   * 要持久化的文件内容。
   */
  content: string;
}

/**
 * 文件保存结果负载。
 */
export interface FileSavePayload {
  /**
   * 已保存的相对路径。
   */
  relativePath: string;
  /**
   * 保存是否成功。
   */
  saved: boolean;
}

/**
 * 用于计算目录大小的请求查询。
 */
export interface DirectorySizeRequest {
  /**
   * 相对目录路径。
   */
  path: string;
}

/**
 * 目录大小负载。
 */
export interface DirectorySizePayload {
  /**
   * 相对目录路径。
   */
  relativePath: string;
  /**
   * 目录总大小，单位为字节。
   */
  totalSize: number;
}

/**
 * 每个选中项的大小信息。
 */
export interface SelectionSizeItem {
  /**
   * 选中内容中包含的相对路径。
   */
  relativePath: string;
  /**
   * 该路径的总大小，单位为字节。
   */
  totalSize: number;
}

/**
 * 用于计算选中内容大小的请求体。
 */
export interface SelectionSizeRequest {
  /**
   * 要计算的相对路径。
   */
  paths: string[];
}

/**
 * 选中内容大小负载。
 */
export interface SelectionSizePayload {
  /**
   * 标准化后的相对路径。
   */
  relativePaths: string[];
  /**
   * 选中内容的总大小，单位为字节。
   */
  totalSize: number;
  /**
   * 每个路径的大小明细。
   */
  items: SelectionSizeItem[];
}

/**
 * 用于删除多个路径的请求体。
 */
export interface FileBatchDeleteRequest {
  /**
   * 要删除的相对路径。
   */
  paths: string[];
}

/**
 * 批量删除结果负载。
 */
export interface FileBatchDeletePayload {
  /**
   * 已删除的相对路径。
   */
  relativePaths: string[];
  /**
   * 删除是否成功。
   */
  deleted: boolean;
}

/**
 * 用于重命名文件系统项的请求体。
 */
export interface FileRenameRequest {
  /**
   * 当前的相对路径。
   */
  path: string;
  /**
   * 新的基础名称。
   */
  newName: string;
}

/**
 * 重命名结果负载。
 */
export interface FileRenamePayload {
  /**
   * 先前的相对路径。
   */
  relativePath: string;
  /**
   * 新的相对路径。
   */
  newRelativePath: string;
  /**
   * 重命名是否成功。
   */
  renamed: boolean;
}

/**
 * 用于复制文件系统项的请求体。
 */
export interface FileCopyRequest {
  /**
   * 要复制的相对路径。
   */
  paths: string[];
}

/**
 * 复制结果负载。
 */
export interface FileCopyPayload {
  /**
   * 用户请求的源路径。
   */
  sourcePaths: string[];
  /**
   * 存储在剪贴板缓冲区中的路径。
   */
  copiedPaths: string[];
  /**
   * 复制准备是否成功。
   */
  copied: boolean;
}

/**
 * 用于粘贴复制项的请求体。
 */
export interface FilePasteRequest {
  /**
   * 粘贴操作的目标目录。
   */
  targetDirectory: string;
  /**
   * 可选的显式源路径。
   */
  sourcePaths?: string[];
}

/**
 * 粘贴结果负载。
 */
export interface FilePastePayload {
  /**
   * 目标目录。
   */
  targetDirectory: string;
  /**
   * 粘贴操作中使用的源路径。
   */
  sourcePaths: string[];
  /**
   * 新创建的目标路径。
   */
  pastedPaths: string[];
  /**
   * 粘贴是否成功。
   */
  pasted: boolean;
}