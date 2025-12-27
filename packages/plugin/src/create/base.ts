/**
 * 插件基类 - 极简版
 * @module create/base
 */

import path from 'node:path'
import crypto from 'node:crypto'
import type { PluginType } from '../types'

let idCounter = 0

export const createPluginId = (pkg: string, type: PluginType, file: string) =>
  `${pkg}:${type}:${file}:${idCounter++}:${Date.now()}`

export interface PluginCacheFile {
  absPath: string
  dirname: string
  basename: string
}

export abstract class BuilderBase {
  protected _id: string | null = null
  protected _log: (...args: unknown[]) => void = console.log
  protected _packageName = 'unknown'
  protected _callerPath = ''

  get callerPath () { return this._callerPath }
  setCallerPath (p: string) { this._callerPath = p.replaceAll('\\', '/') }

  get file (): PluginCacheFile {
    return {
      absPath: this._callerPath,
      dirname: path.dirname(this._callerPath).replaceAll('\\', '/'),
      basename: path.basename(this._callerPath),
    }
  }

  abstract get type (): PluginType
  get packageName () { return this._packageName }
  setPackageName (n: string) { this._packageName = n }

  get id () {
    return (this._id ??= createPluginId(this.packageName, this.type, this.file.basename))
  }

  log (...args: unknown[]) { this._log(...args) }

  setLog (enabled: boolean) {
    const prefix = `[${this.packageName}:${this.file.basename}]`
    this._log = enabled ? (...a: unknown[]) => console.log(prefix, ...a) : () => { }
  }

  get defaultAppName () {
    return crypto.createHash('md5').update(this._callerPath).digest('hex').slice(0, 7)
  }
}
