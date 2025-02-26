import { request } from '@/lib/request'
import { KarinStatus } from '@/types/server'
import { useRequest } from 'ahooks'
import { useEffect, useRef, } from 'react'

const ConsoleMessage = () => {
  const hasPrinted = useRef(false)
  const { data } = useRequest(() => request.serverGet<KarinStatus>('/api/v1/status/karin'))
  useEffect(() => {
    if (import.meta.env.MODE !== 'development') {
      if (!hasPrinted.current && data) {
        console.log('%c🚀 Karin WebUI Console', 'color: white; background-color: #2c3e50; padding: 5px 10px; border-radius: 5px; font-size: 16px;')
        console.log('%cVersion: %s', 'color: #9b59b6; font-size: 14px;', data?.version)
        console.log('%c© 2025 KarinJS. All rights reserved.', 'color: #7f8c8d; font-size: 12px;')
        console.log('%cPowered by @KarinJS/node-karin@%s', 'color: #3498db; font-size: 12px;', data?.version)
        //         const asciiArt = `
        //  ___  __    ________  ________  ___  ________
        // |\\  \\|\\  \\ |\\   __  \\|\\   __  \\|\\  \\|\\   ___  \\
        // \\ \\  \\/  /|\\ \\  \\|\\  \\ \\  \\|\\  \\ \\  \\ \\  \\\\ \\  \\
        //  \\ \\   ___  \\ \\   __  \\ \\   _  _\\ \\  \\ \\  \\\\ \\  \\
        //   \\ \\  \\\\ \\  \\ \\  \\ \\  \\ \\  \\\\  \\\\ \\  \\ \\  \\\\ \\  \\
        //    \\ \\__\\\\ \\__\\ \\__\\ \\__\\ \\__\\\\ _\\\\ \\__\\ \\__\\\\ \\__\\
        //     \\|__| \\|__|\\|__|\\|__|\\|__|\\|__|\\|__|\\|__| \\|__|

        //  ___       __   _______   ________  ___  ___  ___
        // |\\  \\     |\\  \\|\\  ___ \\ |\\   __  \\|\\  \\|\\  \\|\\  \\
        // \\ \\  \\    \\ \\  \\ \\   __/|\\ \\  \\|\\ /\\ \\  \\\\\\  \\ \\  \\
        //  \\ \\  \\  __\\ \\  \\ \\  \\_|/_\\ \\   __  \\ \\  \\\\\\  \\ \\  \\
        //   \\ \\  \\|\\__\\_\\  \\ \\  \\_|\\ \\ \\  \\|\\  \\ \\  \\\\\\  \\ \\  \\
        //    \\ \\____________\\ \\_______\\ \\_______\\ \\_______\\ \\__\\
        //     \\|____________|\\|_______|\\|_______|\\|_______|\\|__|

        //                  © 2025 KarinJS. All rights reserved.
        //                  Powered by @KarinJS/node-karin@${data?.version}
        // `
        //         console.log(asciiArt)
        hasPrinted.current = true // 标记为已打印
      }
    }
  }, [data])

  return null
}

export default ConsoleMessage
