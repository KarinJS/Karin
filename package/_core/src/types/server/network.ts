/**
 * 网络状态
 */
export interface NetworkStatus {
  /** 上传速度 */
  upload: number
  /** 下载速度 */
  download: number
  /** 总上传量 */
  totalSent: number
  /** 总下载量 */
  totalReceived: number
}
