import { createContext } from 'react'
import useSandboxWebsoocket from '@/hooks/sandbox/use_sandbox_ws'

interface SandboxContextType {
  ws: ReturnType<typeof useSandboxWebsoocket>
}

export const SandboxContext = createContext<SandboxContextType>({
  ws: {
    connecting: false,
    connected: false,
    error: null,
    ready: false,
    ws: null,
    botInfo: {
      id: 'karin',
      name: 'Karin',
      avatar: '/web/karin.png',
    },
  },
})

export function SandboxProvider({ children }: { children: React.ReactNode }) {
  const ws = useSandboxWebsoocket()
  return (
    <SandboxContext.Provider
      value={{
        ws: ws,
      }}
    >
      {children}
    </SandboxContext.Provider>
  )
}
