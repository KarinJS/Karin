import type { NavigateOptions } from 'react-router-dom'

import { HeroUIProvider } from '@heroui/system'
import { useHref, useNavigate } from 'react-router-dom'
import DialogProvider from '@/contexts/dialog'

import Toaster from '@/components/toaster.tsx'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <DialogProvider>
        <Toaster />
        {children}
      </DialogProvider>
    </HeroUIProvider>
  )
}
