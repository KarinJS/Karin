import type { Task } from './task'
import type { Button } from './button'
import type { Accept } from './accept'
import type { Handler } from './handler'
import type { Command, CommandClass } from './command'

/**
 * 全部插件方法联合类型
 */
export type AllPluginMethods = Accept
  | Button
  | Handler
  | Task
  | Command
  | CommandClass
