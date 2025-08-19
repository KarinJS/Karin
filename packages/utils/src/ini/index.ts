import {
  parse,
  decode,
  stringify,
  encode,
  safe,
  unsafe,
} from 'ini'
import { readFileSync, writeFileSync } from 'node:fs'

/**
 * INI 解析器
 */
export const ini = {
  /**
   * 解析 INI 格式字符串为对象 (parse 是 decode 的别名)
   * @example
   * ```ts
   * ini.parse('key=value\n[section]\nfoo=bar')
   * // => { key: 'value', section: { foo: 'bar' } }
   * ```
   */
  parse,
  /**
   * 解码 INI 格式字符串为对象
   * @example
   * ```ts
   * ini.decode('key=value\n[section]\nfoo=bar')
   * // => { key: 'value', section: { foo: 'bar' } }
   * ```
   */
  decode,
  /**
   * 将对象编码为 INI 格式字符串 (stringify 是 encode 的别名)
   * @example
   * ```ts
   * ini.stringify({ key: 'value', section: { foo: 'bar' } })
   * // => 'key=value\n\n[section]\nfoo=bar\n'
   * ```
   */
  stringify,
  /**
   * 将对象编码为 INI 格式字符串
   * @example
   * ```ts
   * ini.encode({ key: 'value', section: { foo: 'bar' } })
   * // => 'key=value\n\n[section]\nfoo=bar\n'
   * ```
   */
  encode,
  /**
   * 将字符串转换为安全的 INI 键或值
   * @example
   * ```ts
   * ini.safe('"unsafe string"')
   * // => '\\"unsafe string\\"'
   * ```
   */
  safe,
  /**
   * 将转义的字符串还原为原始字符串
   * @example
   * ```ts
   * ini.unsafe('\\"safe string\\"')
   * // => '"safe string"'
   * ```
   */
  unsafe,
  /**
   * 读取并解析 INI 文件
   * @param filePath - 文件路径
   * @param encoding - 文件编码，默认为 'utf8'
   * @returns 解析后的对象
   * @example
   * ```ts
   * // 读取配置文件
   * const config = ini.readFile('./config.ini')
   * // => { database: { host: 'localhost' }, app: { name: 'myapp' } }
   *
   * // 使用泛型指定返回类型
   * interface Config {
   *   database: { host: string; port: number }
   *   app: { name: string; version: string }
   * }
   * const config = ini.readFile<Config>('./config.ini')
   * ```
   */
  readFile<T = Record<string, any>> (filePath: string, encoding: BufferEncoding = 'utf8'): T {
    const content = readFileSync(filePath, { encoding })
    return parse(content) as T
  },
  /**
   * 将对象编码为 INI 格式并写入文件
   * @param filePath - 文件路径
   * @param data - 要写入的数据对象
   * @param options - 写入选项
   * @param encoding - 文件编码，默认为 'utf8'
   * @example
   * ```ts
   * const config = {
   *   database: { host: 'localhost', port: 3306 },
   *   app: { name: 'myapp', version: '1.0.0' }
   * }
   *
   * // 基本写入
   * ini.writeFile('./config.ini', config)
   *
   * // 使用选项
   * ini.writeFile('./config.ini', config, {
   *   whitespace: true,
   *   align: true,
   *   section: 'main'
   * })
   *
   * // 指定编码
   * ini.writeFile('./config.ini', config, {}, 'utf16le')
   * ```
   */
  writeFile (
    filePath: string,
    data: any,
    options: Parameters<typeof stringify>[1] = {},
    encoding: BufferEncoding = 'utf8'
  ): void {
    const content = stringify(data, options)
    writeFileSync(filePath, content, { encoding })
  },
}
