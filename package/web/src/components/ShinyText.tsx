import React from 'react'

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`

  return (
    <div
      className={`text-default/10 bg-clip-text inline-block ${disabled ? '' : 'animate-shine'
        } ${className} bg-gradient-to-r bg-[length:200%_100%] from-transparent via-default-900 to-transparent`}
      style={{
        WebkitBackgroundClip: 'text',
        animationDuration,
      }}
    >
      {text}
    </div>
  )
}

export default ShinyText

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         shine: {
//           '0%': { 'background-position': '100%' },
//           '100%': { 'background-position': '-100%' },
//         },
//       },
//       animation: {
//         shine: 'shine 5s linear infinite',
//       },
//     },
//   },
//   plugins: [],
// };
