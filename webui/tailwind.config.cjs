const { heroui } = require("@heroui/react")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
      },
      animation: {
        shine: 'shine 5s linear infinite',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui(),
    function ({ addComponents }) {
      addComponents({
        '.glass-effect': {
          display: 'flex',
          backdropFilter: 'blur(16px)',
          backgroundImage: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.08))',
          borderTop: '1px solid rgba(255, 255, 255, 0.4)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
          transform: 'scale(1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            backgroundImage: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.15), transparent)',
            opacity: '0',
            transition: 'opacity 0.3s ease',
          },
          '&:hover': {
            backgroundImage: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0.12))',
          },
          '&:hover::before': {
            opacity: '1',
          },
          '.dark &': {
            backgroundImage: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          },
          '.dark &:hover': {
            backgroundImage: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
          },
        },
      })
    },
  ],
}
