import { checkProcess } from './check'
import { processHandler } from './signalCapture'

/**
 * @internal
 * @description 初始化进程
 * @param port - 端口号
 */
export const initProcess = async (port: number) => {
  processHandler()
  await checkProcess(port)
}
