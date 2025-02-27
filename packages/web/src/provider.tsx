import store from '@/store'
import { ToastProvider } from '@heroui/toast'
import DialogProvider from '@/contexts/dialog'
import { HeroUIProvider } from '@heroui/system'
import { useHref, useNavigate } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import Toaster from '@/components/toaster.tsx'

import type { NavigateOptions } from 'react-router-dom'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

export function Provider ({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <ReduxProvider store={store}>
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        <DialogProvider>
          <Toaster />
          <ToastProvider />
          {children}
        </DialogProvider>
      </HeroUIProvider>
    </ReduxProvider>
  )
}
