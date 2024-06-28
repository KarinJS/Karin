import { Logger as LoggerType } from 'log4js'
import { Logger } from 'karin/types'

declare global {
  var logger: LoggerType & Logger
}
