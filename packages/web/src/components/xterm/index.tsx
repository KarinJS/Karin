import { CanvasAddon } from '@xterm/addon-canvas'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
// import { WebglAddon } from '@xterm/addon-webgl'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import clsx from 'clsx'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

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

// 判断是否为移动设备的函数
const isMobileDevice = () => {
  return window.innerWidth < 768 // 通常 768px 是移动设备和平板的分界点
}

const XTerm = forwardRef<XTermRef, XTermProps>((props, ref) => {
  const domRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<Terminal | null>(null)
  const { className, onInput, onKey, onResize, ...rest } = props
  // 添加字体大小状态
  const [fontSize, setFontSize] = useState(isMobileDevice() ? 12 : 15)

  useEffect(() => {
    const terminal = new Terminal({
      allowTransparency: true,
      fontFamily:
        '"JetBrains Mono", "Aa偷吃可爱长大的", "Noto Serif SC", monospace',
      cursorInactiveStyle: 'outline',
      drawBoldTextInBrightColors: false,
      fontSize, // 使用响应式字体大小
      lineHeight: 1.2,
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
      const newFontSize = isMobileDevice() ? 12 : 15
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
        return terminalRef.current?.write(...args)
      },
      writeAsync: async (data) => {
        return new Promise((resolve) => {
          terminalRef.current?.write(data, resolve)
        })
      },
      writeln: (...args) => {
        return terminalRef.current?.writeln(...args)
      },
      writelnAsync: async (data) => {
        return new Promise((resolve) => {
          terminalRef.current?.writeln(data, resolve)
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
