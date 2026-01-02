import { twMerge } from 'tailwind-merge'

export function Logo ({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge("select-none", className)}
    >
      <defs>
        <linearGradient id="shardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" /> {/* Sky 100 */}
          <stop offset="100%" stopColor="#7DD3FC" /> {/* Sky 300 */}
        </linearGradient>
        <linearGradient id="shardGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BAE6FD" /> {/* Sky 200 */}
          <stop offset="100%" stopColor="#38BDF8" /> {/* Sky 400 */}
        </linearGradient>
        <linearGradient id="shardGrad3" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#7DD3FC" /> {/* Sky 300 */}
          <stop offset="100%" stopColor="#0EA5E9" /> {/* Sky 500 */}
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 
        Concept: "The Azure Trinity"
        Three aerodynamic shards converging in a circular motion.
        Represents: Speed (Vite), Structure (React), and Modularity (Plugins).
        Style: Modern, Geometric, "Dribbble-esque".
      */}

      <g transform="translate(50 50)">
        {/* Shard 1: Top Right */}
        <path
          d="M 5 -25 Q 25 -25 35 -5 L 15 20 Q 5 5 5 -25 Z"
          fill="url(#shardGrad1)"
          transform="rotate(0)"
        />

        {/* Shard 2: Bottom */}
        <path
          d="M 5 -25 Q 25 -25 35 -5 L 15 20 Q 5 5 5 -25 Z"
          fill="url(#shardGrad2)"
          transform="rotate(120)"
        />

        {/* Shard 3: Top Left */}
        <path
          d="M 5 -25 Q 25 -25 35 -5 L 15 20 Q 5 5 5 -25 Z"
          fill="url(#shardGrad3)"
          transform="rotate(240)"
        />

        {/* Center Negative Space Triangle - Created naturally by the overlap */}
      </g>
    </svg>
  )
}
