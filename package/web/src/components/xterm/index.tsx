import { CanvasAddon } from '@xterm/addon-canvas'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
// import { WebglAddon } from '@xterm/addon-webgl'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import clsx from 'clsx'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

/**
 * 导入HarmonyOS字体
 */
import './xterm.css'

export type XTermRef = {
  write: (
    ...args: Parameters<Terminal['write']>
  ) => ReturnType<Terminal['write']>
  writeAsync: (data: Parameters<Terminal['write']>[0]) => Promise<void>
  writeln: (
    ...args: Parameters<Terminal['writeln']>
  ) => ReturnType<Terminal['writeln']>
  writelnAsync: (data: Parameters<Terminal['writeln']>[0]) => Promise<void>
  clear: () => void
  terminalRef: React.RefObject<Terminal | null>
}

export interface XTermProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onInput' | 'onResize'> {
  onInput?: (data: string) => void
  onKey?: (key: string, event: KeyboardEvent) => void
  onResize?: (cols: number, rows: number) => void // 新增属性
}

/**
 * 判断是否为移动设备的函数
 */
const isMobileDevice = () => {
  return window.innerWidth < 768 // 通常 768px 是移动设备和平板的分界点
}

const XTerm = forwardRef<XTermRef, XTermProps>((props, ref) => {
  const domRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<Terminal | null>(null)
  const { className, onInput, onKey, onResize, ...rest } = props
  // 添加字体大小状态
  const [fontSize, setFontSize] = useState(isMobileDevice() ? 8 : 14)

  useEffect(() => {
    const terminal = new Terminal({
      allowTransparency: true,
      fontFamily:
        '"HarmonyOS", "Consolas", monospace',
      cursorStyle: 'bar',
      cursorWidth: 1,
      cursorBlink: true,
      cursorInactiveStyle: 'outline',
      drawBoldTextInBrightColors: false,
      fontSize, // 使用响应式字体大小
      lineHeight: 0.8, // 极大减少行高以缩小字体间隙
      letterSpacing: -0.1, // 使用负值减少字符间距
      theme: {
        background: '#0C0C0C',
        foreground: '#CCCCCC',
        black: '#0C0C0C',
        red: '#C50F1F',
        green: '#13A10E',
        yellow: '#C19C00',
        blue: '#0037DA',
        magenta: '#881798',
        cyan: '#3A96DD',
        white: '#CCCCCC',
        brightBlack: '#767676',
        brightRed: '#E74856',
        brightGreen: '#16C60C',
        brightYellow: '#F9F1A5',
        brightBlue: '#3B78FF',
        brightMagenta: '#B4009E',
        brightCyan: '#61D6D6',
        brightWhite: '#F2F2F2',
        selectionBackground: '#FFFFFF40',
        cursor: '#FFFFFF'
      },
      allowProposedApi: true,
      windowsMode: true, // 添加Windows特定模式
      windowsPty: {
        backend: 'conpty'
      }
    })
    terminalRef.current = terminal
    const fitAddon = new FitAddon()
    terminal.loadAddon(
      new WebLinksAddon((event, uri) => {
        if (event.ctrlKey || event.metaKey) {
          window.open(uri, '_blank')
        }
      })
    )
    terminal.loadAddon(fitAddon)
    terminal.open(domRef.current!)

    terminal.loadAddon(new CanvasAddon())
    terminal.onData((data) => {
      if (onInput) {
        onInput(data)
      }
    })

    terminal.onKey((event) => {
      if (onKey) {
        onKey(event.key, event.domEvent)
      }
    })

    // 监听窗口大小变化，调整字体大小
    const handleResize = () => {
      const newFontSize = isMobileDevice() ? 12 : 14
      if (newFontSize !== fontSize) {
        setFontSize(newFontSize)
        terminal.options.fontSize = newFontSize
        fitAddon.fit()
      }
    }

    window.addEventListener('resize', handleResize)

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit()
      // 获取当前终端尺寸
      const cols = terminal.cols
      const rows = terminal.rows
      if (onResize) {
        onResize(cols, rows)
      }
    })

    // 字体加载完成后重新调整终端大小
    document.fonts.ready.then(() => {
      fitAddon.fit()

      resizeObserver.observe(domRef.current!)
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
      setTimeout(() => {
        terminal.dispose()
      }, 0)
    }
  }, [fontSize])

  useImperativeHandle(
    ref,
    () => ({
      write: (...args) => {
        const result = terminalRef.current?.write(...args)
        // 确保光标位置正确，通过检查输入是否包含换行符
        if (typeof args[0] === 'string' && args[0].includes('\n') && terminalRef.current) {
          // 对于多行输入，确保光标移动到内容的最后位置
          const lines = args[0].split('\n')
          if (lines.length > 1) {
            // 发送一个空字符并立即删除，触发终端重新计算光标位置
            terminalRef.current.write(' \b')
          }
        }
        return result
      },
      writeAsync: async (data) => {
        return new Promise((resolve) => {
          terminalRef.current?.write(data, () => {
            // 处理多行内容的光标问题
            if (typeof data === 'string' && data.includes('\n') && terminalRef.current) {
              // 发送一个空字符并立即删除，触发终端重新计算光标位置
              terminalRef.current.write(' \b', resolve)
            } else {
              resolve()
            }
          })
        })
      },
      writeln: (...args) => {
        const result = terminalRef.current?.writeln(...args)
        // writeln本身会添加换行符，所以也需要处理光标位置
        if (terminalRef.current) {
          // 发送一个空字符并立即删除，触发终端重新计算光标位置
          terminalRef.current.write(' \b')
        }
        return result
      },
      writelnAsync: async (data) => {
        return new Promise((resolve) => {
          terminalRef.current?.writeln(data, () => {
            // 处理光标位置
            if (terminalRef.current) {
              // 发送一个空字符并立即删除，触发终端重新计算光标位置
              terminalRef.current.write(' \b', resolve)
            } else {
              resolve()
            }
          })
        })
      },
      clear: () => {
        terminalRef.current?.clear()
      },
      terminalRef
    }),
    []
  )

  return (
    <div
      className={clsx(
        'p-0 rounded-md w-full h-full overflow-hidden',
        'bg-[#0C0C0C]',
        'touch-manipulation',
        className
      )}
      {...rest}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          padding: '0.5rem'
        }}
        ref={domRef}
      />
    </div>
  )
})

export default XTerm
