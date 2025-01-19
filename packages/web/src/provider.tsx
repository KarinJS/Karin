import type { NavigateOptions } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'

import { HeroUIProvider } from '@heroui/system'
import { useHref, useNavigate } from 'react-router-dom'
import DialogProvider from '@/contexts/dialog'

import Toaster from '@/components/toaster.tsx'
import store from '@/store'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <ReduxProvider store={store}>
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        <DialogProvider>
          <Toaster />
          {children}
        </DialogProvider>
      </HeroUIProvider>
    </ReduxProvider>
  )
}
