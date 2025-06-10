import { useRef, useEffect } from 'react'

interface TextPressureProps {
  text?: string
  fontFamily?: string
  fontUrl?: string
  weight?: boolean
  italic?: boolean
  alpha?: boolean
  stroke?: boolean
  strokeColor?: string
  strokeWidth?: number
  className?: string
}

const TextPressure: React.FC<TextPressureProps> = ({
  text = 'Compressa',
  fontFamily = 'Compressa VF',
  fontUrl = '/web/CompressaPRO-GX.woff2',
  weight = true,
  italic = true,
  alpha = false,
  stroke = false,
  strokeColor = '#FF0000',
  strokeWidth = 2,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const spansRef = useRef<(HTMLSpanElement | null)[]>([])

  const mouseRef = useRef({ x: 0, y: 0 })
  const cursorRef = useRef({ x: 0, y: 0 })

  const chars = text.split('')

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x
    const dy = b.y - a.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX
      cursorRef.current.y = e.clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      cursorRef.current.x = t.clientX
      cursorRef.current.y = t.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      mouseRef.current.x = left + width / 2
      mouseRef.current.y = top + height / 2
      cursorRef.current.x = mouseRef.current.x
      cursorRef.current.y = mouseRef.current.y
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  useEffect(() => {
    let rafId: number
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect()
        const maxDist = titleRect.width / 2

        spansRef.current.forEach((span) => {
          if (!span) return

          const rect = span.getBoundingClientRect()
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          }

          const d = dist(mouseRef.current, charCenter)

          const getAttr = (distance: number, minVal: number, maxVal: number) => {
            const val = maxVal - Math.abs((maxVal * distance) / maxDist)
            return Math.max(minVal, val + minVal)
          }

          const wdth = 100 // 固定宽度
          const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400
          const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : '0'
          const alphaVal = alpha ? getAttr(d, 0, 1).toFixed(2) : '1'

          span.style.opacity = alphaVal
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`
        })
      }

      rafId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(rafId)
  }, [weight, italic, alpha, chars.length])

  return (
    <div
      ref={containerRef}
      className='relative overflow-hidden bg-transparent px-6 w-full select-none'
    >
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }
        .stroke span {
          position: relative;
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
      `}
      </style>

      <h1
        ref={titleRef}
        className={`text-pressure-title text-default-600 ${className} flex justify-between ${stroke ? 'stroke' : ''} uppercase text-center text-6xl leading-none`}
        style={{
          fontFamily,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el: HTMLSpanElement | null): void => {
              spansRef.current[i] = el
            }}
            data-char={char}
            className='inline-block'
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  )
}

export default TextPressure
