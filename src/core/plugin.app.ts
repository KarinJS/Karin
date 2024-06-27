import { dirName, fileName, PluginApps } from 'karin/types/index'

export interface PluginAppType {
  file?: {
    dir?: dirName
    name?: fileName
    type?: PluginApps['file']['type']
    fnc?: PluginApps['file']['Fnc']
  }
  name?: string
  event?: PluginApps['event']
  priority?: number
  accept?: boolean
  rule?: PluginApps['rule']
}

export default function PluginApp (options: PluginAppType): PluginApps {
  return {
    file: {
      dir: options?.file?.dir || '' as dirName,
      name: options?.file?.name || '' as fileName,
      type: options?.file?.type || 'function',
      Fnc: options?.file?.fnc || '',
    },
    name: options.name || '',
    event: options.event || 'message',
    priority: options.priority || 10000,
    accept: options.accept ?? false,
    rule: options.rule || [],
    task: [],
    handler: [],
    button: [],
  }
}
