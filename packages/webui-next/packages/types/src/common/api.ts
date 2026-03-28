/**
 * 标准 API 响应包体。
 *
 * @typeParam TData - 端点返回的业务负载。
 */
export interface ApiResponse<TData> {
  /**
   * 业务状态码。
   *
   * `0` 通常表示成功。
   */
  code: 0;
  /**
   * 人类可读的响应消息。
   */
  message: string;
  /**
   * 业务负载。
   */
  data: TData;
}

/**
 * Web UI 使用的已知 HTTP API 路径。
 */
export enum ApiPath {
  /**
   * 使用 HTTP 认证密钥换取访问令牌。
   */
  Login = '/api/v2/login',
  /**
   * 刷新访问令牌。
   */
  RefreshToken = '/api/v2/auth/refresh',
  /**
   * 获取仪表盘趋势数据。
   */
  DashboardTrend = '/api/v2/dashboard/trend',
  /**
   * 通过 SSE 订阅仪表盘实时更新。
   */
  DashboardRealtimeStream = '/api/v2/dashboard/realtime-stream',
  /**
   * 通过 SSE 订阅终端日志。
   */
  LogsStream = '/api/v2/logs/stream',
  /**
   * 列出目录中的文件。
   */
  FilesList = '/api/v2/files/list',
  /**
   * 读取文件元数据和内容。
   */
  FilesContent = '/api/v2/files/content',
  /**
   * 删除单个文件或目录。
   */
  FilesDelete = '/api/v2/files/delete',
  /**
   * 保存文件内容。
   */
  FilesSave = '/api/v2/files/save',
  /**
   * 计算所选内容的总大小。
   */
  FilesSelectionSize = '/api/v2/files/selection-size',
  /**
   * 删除多个文件或目录。
   */
  FilesDeleteSelection = '/api/v2/files/delete-selection',
  /**
   * 重命名文件或目录。
   */
  FilesRename = '/api/v2/files/rename',
  /**
   * 将文件或目录复制到剪贴板缓冲区。
   */
  FilesCopy = '/api/v2/files/copy',
  /**
   * 将复制的文件或目录粘贴到目标目录中。
   */
  FilesPaste = '/api/v2/files/paste',
  /**
   * 计算目录大小。
   */
  FilesDirectorySize = '/api/v2/files/directory-size',
  /**
   * 获取插件市场列表数据。
   */
  PluginStoreList = '/api/v2/plugins/store',
  /**
   * 获取插件市场详情数据。
   */
  PluginStoreDetail = '/api/v2/plugins/detail',
  /**
   * 后端健康检查 websocket 端点。
   */
  HealthWebSocket = '/ws/health'
}
