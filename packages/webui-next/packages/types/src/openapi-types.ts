import type { ApiResponse } from './common';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserInfo
} from './auth';
import type {
  AdapterInfo,
  BotInfo,
  ChartDataPoint,
  DashboardData,
  DashboardMetrics,
  DashboardRealtimeData,
  DashboardRuntimeInfo
} from './dashboard';
import type {
  DirectorySizePayload,
  FileBatchDeletePayload,
  FileBatchDeleteRequest,
  FileContentPayload,
  FileCopyPayload,
  FileCopyRequest,
  FileDeletePayload,
  FileDeleteRequest,
  FileListPayload,
  FilePastePayload,
  FilePasteRequest,
  FileRenamePayload,
  FileRenameRequest,
  FileSavePayload,
  FileSaveRequest,
  FileSystemItem,
  FileSystemItemType,
  SelectionSizeItem,
  SelectionSizePayload,
  SelectionSizeRequest
} from './files';
import type {
  BackendHealthMessage,
  BackendHealthStatus,
  TerminalLog,
  TerminalLogLevel
} from './layout';
import type {
  PluginCategory,
  PluginDetail,
  PluginFeature,
  PluginListItem,
  PluginMetaInfo,
  PluginSortKey,
  PluginStoreDetailPayload,
  PluginStoreListPayload
} from './plugins';

export type {
  AdapterInfo,
  BackendHealthMessage,
  BackendHealthStatus,
  BotInfo,
  ChartDataPoint,
  DashboardData,
  DashboardMetrics,
  DashboardRealtimeData,
  DashboardRuntimeInfo,
  DirectorySizePayload,
  FileBatchDeletePayload,
  FileBatchDeleteRequest,
  FileContentPayload,
  FileCopyPayload,
  FileCopyRequest,
  FileDeletePayload,
  FileDeleteRequest,
  FileListPayload,
  FilePastePayload,
  FilePasteRequest,
  FileRenamePayload,
  FileRenameRequest,
  FileSavePayload,
  FileSaveRequest,
  FileSystemItem,
  FileSystemItemType,
  LoginRequest,
  LoginResponse,
  PluginCategory,
  PluginDetail,
  PluginFeature,
  PluginListItem,
  PluginMetaInfo,
  PluginSortKey,
  PluginStoreDetailPayload,
  PluginStoreListPayload,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SelectionSizeItem,
  SelectionSizePayload,
  SelectionSizeRequest,
  TerminalLog,
  TerminalLogLevel,
  UserInfo
};

/**
 * 登录的具体 API 响应类型。
 */
export type ApiResponse_LoginResponse = ApiResponse<LoginResponse>;

/**
 * 令牌刷新的具体 API 响应类型。
 */
export type ApiResponse_RefreshTokenResponse = ApiResponse<RefreshTokenResponse>;

/**
 * 仪表盘数据的具体 API 响应类型。
 */
export type ApiResponse_DashboardData = ApiResponse<DashboardData>;

/**
 * 仪表盘实时数据的具体 API 响应类型。
 */
export type ApiResponse_DashboardRealtimeData = ApiResponse<DashboardRealtimeData>;

/**
 * 文件列表数据的具体 API 响应类型。
 */
export type ApiResponse_FileListPayload = ApiResponse<FileListPayload>;

/**
 * 文件内容数据的具体 API 响应类型。
 */
export type ApiResponse_FileContentPayload = ApiResponse<FileContentPayload>;

/**
 * 单个文件删除结果的具体 API 响应类型。
 */
export type ApiResponse_FileDeletePayload = ApiResponse<FileDeletePayload>;

/**
 * 文件保存结果的具体 API 响应类型。
 */
export type ApiResponse_FileSavePayload = ApiResponse<FileSavePayload>;

/**
 * 目录大小结果的具体 API 响应类型。
 */
export type ApiResponse_DirectorySizePayload = ApiResponse<DirectorySizePayload>;

/**
 * 选择大小结果的具体 API 响应类型。
 */
export type ApiResponse_SelectionSizePayload = ApiResponse<SelectionSizePayload>;

/**
 * 批量删除结果的具体 API 响应类型。
 */
export type ApiResponse_FileBatchDeletePayload = ApiResponse<FileBatchDeletePayload>;

/**
 * 重命名结果的具体 API 响应类型。
 */
export type ApiResponse_FileRenamePayload = ApiResponse<FileRenamePayload>;

/**
 * 复制结果的具体 API 响应类型。
 */
export type ApiResponse_FileCopyPayload = ApiResponse<FileCopyPayload>;

/**
 * 粘贴结果的具体 API 响应类型。
 */
export type ApiResponse_FilePastePayload = ApiResponse<FilePastePayload>;

/**
 * 插件列表结果的具体 API 响应类型。
 */
export type ApiResponse_PluginStoreListPayload = ApiResponse<PluginStoreListPayload>;

/**
 * 插件详情结果的具体 API 响应类型。
 */
export type ApiResponse_PluginStoreDetailPayload = ApiResponse<PluginStoreDetailPayload>;