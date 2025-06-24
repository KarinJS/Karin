/**
 * ws请求回调
 */
export interface Echo {
  /** 状态 */
  status: 'failed' | 'ok'
  /**
   * 状态码
   * - http:
   *   - 如果 access token 未提供，状态码为 401（关于 access token，见 鉴权）
   *   - 如果 access token 不符合，状态码为 403
   *   - 如果 POST 请求的 Content-Type 不支持，状态码为 406
   *   - 如果 POST 请求的正文格式不正确，状态码为 400
   *   - 如果 API 不存在，状态码为 404
   *   - 剩下的所有情况，无论操作实际成功与否，状态码都是 200
   * - ws:
   *   - HTTP 状态码反应的错误情况被移动到响应 JSON 的 retcode 字段
   *   - 例如，HTTP 返回 404 的情况，在响应 JSON 的 retcode 字段返回 1404
   *   - 实际上 1401 和 1403 并不会真的返回，因为如果建立连接时鉴权失败，连接会直接断开，根本不可能进行到后面的 API 调用阶段
   */
  retcode: number
  /** 数据 */
  data: unknown
  /** 请求ID */
  echo: string
  /** GoCQ拓展: 错误消息, 仅在 API 调用失败时有该字段 */
  msg?: string
  /** GoCQ拓展: 对错误的详细解释(中文), 仅在 API 调用失败时有该字段 */
  wording?: string
}
