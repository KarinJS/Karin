import { useEffect, useRef } from 'react'

const ConsoleMessage = () => {
  const hasPrinted = useRef(false)

  useEffect(() => {
    if (import.meta.env.MODE !== 'development') {
      if (!hasPrinted.current) {
        const asciiArt = `
 /$$   /$$                  /$$
| $$  /$$/                 |__/
| $$ /$$/  /$$$$$$  /$$$$$$ /$$/$$$$$$$
| $$$$$/  |____  $$/$$__  $| $| $$__  $$
| $$  $$   /$$$$$$| $$  \\__| $| $$  \\ $$
| $$\\  $$ /$$__  $| $$     | $| $$  | $$
| $$ \\  $|  $$$$$$| $$     | $| $$  | $$
|__/  \\__/\\_______|__/     |__|__/  |__/
`
        console.log(asciiArt)
        hasPrinted.current = true
      }
    }
  }, [])

  return null
}

export default ConsoleMessage
