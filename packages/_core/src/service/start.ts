/**
 * @internal
 * @description 打印启动日志
 * @param version - 版本号
 */
export const printStartLog = (version: string) => {
  logger.mark('Karin 启动中...')
  logger.mark(`当前版本: ${version}`)
  logger.mark('https://github.com/KarinJS/Karin')
}
