type LoggerLike = {
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
  trace: (...args: unknown[]) => void
  fatal: (...args: unknown[]) => void
  mark: (...args: unknown[]) => void
}

const noop = (..._args: unknown[]) => {}

const stubLogger: LoggerLike = {
  info: noop,
  warn: noop,
  error: noop,
  debug: noop,
  trace: noop,
  fatal: noop,
  mark: noop,
}

const g = globalThis as Record<string, unknown>
if (!g.logger) g.logger = stubLogger
if (!g.debug) g.debug = () => noop
