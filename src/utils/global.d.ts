import { Logger as LoggerType } from 'log4js'
import { Logger } from '../types/logger'

declare global {
  var logger: LoggerType & Logger
}
