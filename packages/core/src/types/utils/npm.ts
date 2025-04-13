/** .npmrc文件列表接口响应 */
export interface NpmrcFileResponse {
  path: string
  type: 'global' | 'project' | 'pnpm'
  description: string
}

/** npm registry、proxy、https-proxy配置 */
export interface NpmBaseConfigResponse {
  registry: string
  proxy: string
  'https-proxy': string
}
