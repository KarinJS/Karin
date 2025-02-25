import { MotionValue, motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

interface NumberProps {
  mv: MotionValue<number>
  number: number
  height: number
}

function Number ({ mv, number, height }: NumberProps) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10
    const offset = (10 + number - placeValue) % 10
    let memo = offset * height
    if (offset > 5) {
      memo -= 10 * height
    }
    return memo
  })

  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return <motion.span style={{ ...style, y }}>{number}</motion.span>
}

interface DigitProps {
  place: number
  value: number
  height: number
  digitStyle?: React.CSSProperties
}

function Digit ({ place, value, height, digitStyle }: DigitProps) {
  const valueRoundedToPlace = Math.floor(value / place)
  const animatedValue = useSpring(valueRoundedToPlace)

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace)
  }, [animatedValue, valueRoundedToPlace])

  const defaultStyle: React.CSSProperties = {
    height,
    position: 'relative',
    width: '1ch',
    fontVariantNumeric: 'tabular-nums',
  }

  return (
    <div style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  )
}

interface CounterProps {
  value: number
  fontSize?: number
  padding?: number
  places?: number[]
  gap?: number
  borderRadius?: number
  horizontalPadding?: number
  textColor?: string
  fontWeight?: React.CSSProperties['fontWeight']
  className?: string
  containerStyle?: React.CSSProperties
  counterStyle?: React.CSSProperties
  digitStyle?: React.CSSProperties
  gradientHeight?: number
  gradientFrom?: string
  gradientTo?: string
  topGradientStyle?: React.CSSProperties
  bottomGradientStyle?: React.CSSProperties
}

export default function Counter ({
  value,
  fontSize = 100,
  places = [100000, 10000, 1000, 100, 10, 1],
  className,
  fontWeight = 'bold',
  counterStyle,
  digitStyle,
}: CounterProps) {
  const height = fontSize

  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    display: 'flex',
    overflow: 'hidden',
    lineHeight: 1,
    fontWeight,
  }

  return (
    <div
      style={{ ...defaultCounterStyle, ...counterStyle }}
      className={className}
    >
      {places.map((place) => (
        <Digit
          key={place}
          place={place}
          value={value}
          height={height}
          digitStyle={digitStyle}
        />
      ))}
    </div>
  )
}
