import { dirName, EventType, fileName, PluginApps } from 'karin/types'

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
  accept?: boolean | Function
  log?: boolean
  rule?: PluginApps['rule']
  task?: PluginApps['task']
  handler?: PluginApps['handler']
  button?: PluginApps['button']
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
    event: options.event || EventType.Message,
    priority: options.priority || 10000,
    accept: options.accept ?? false,
    log: options.log ?? true,
    rule: options.rule || [],
    task: options.task || [],
    handler: options.handler || [],
    button: options.button || [],
  }
}
