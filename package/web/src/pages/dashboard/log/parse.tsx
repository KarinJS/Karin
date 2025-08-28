const levelColors = {
  trac: '\x1b[34m',  // 蓝色
  debu: '\x1b[36m',  // 青色
  info: '\x1b[32m',  // 绿色
  warn: '\x1b[33m',  // 黄色
  erro: '\x1b[31m',  // 红色
  fata: '\x1b[35m',  // 紫色
  mark: '\x1b[90m'   // 灰色
} as const

/**
  * 解析日志行
  * @param line 日志行
  * @returns 日志行对象
  */
export const parseLogLine = (line: string) => {
  if (!line.trim()) line = ''

  const standardMatch = line.match(/\[(\d{2}:\d{2}:\d{2}\.\d{3})\]\[([A-Z]{3,4})\]\s*([\s\S]+)/)
  if (standardMatch) {
    const [, timestamp, level, message] = standardMatch
    const lowerLevel = level.toLowerCase() as keyof typeof levelColors
    const logMessage = `${levelColors[lowerLevel]}[Karin][${timestamp}][${level}]\x1b[0m ${message}`

    return {
      timestamp,
      level: lowerLevel,
      message: logMessage,
      raw: line
    }
  }

  const now = new Date()
  const timestamp = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0')

  return {
    timestamp,
    level: 'info' as const,
    message: line,
    raw: line
  }
}
