/** .npmrc文件列表接口响应 */
export interface NpmrcFileResponse {
  path: string
  type: string
  description: string
}

/** npm registry、proxy、https-proxy配置 */
export interface NpmBaseConfigResponse {
  registry: string
  proxy: string
  'https-proxy': string
}

/** npm registry配置 */
export interface NpmRegistryResponse {
  _id: string
  _rev: string
  name: string
  'dist-tags': {
    latest: string
    [key: string]: string
  },
  versions: Record<string, {
    name: string
    version: string
    license: string,
    _id: string,
    maintainers: [
      {
        name: string,
        email: string
      }
    ],
    dist: {
      shasum: string,
      tarball: string,
      fileCount: number,
      integrity: string,
      signatures: {
        sig: string,
        keyid: string
      }[],
      unpackedSize: number
    },
    gitHead: string,
    _npmUser: {
      name: string,
      email: string
    },
    _npmVersion: string,
    _nodeVersion: string,
    _hasShrinkwrap: false,
    _npmOperationalInternal: {
      tmp: string,
      host: string
    }
    [key: string]: any
  }>
  time: Record<string, string>
  maintainers: [
    {
      name: string,
      email: string
    },
    {
      name: string,
      email: string
    }
  ],
  readme: string,
  readmeFilename: string
  [key: string]: any
}
