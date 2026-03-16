import { createContext, useContext, type ComponentType } from 'react'
import type { FieldSchema } from './types'

interface FieldRendererContextValue {
  RenderField: ComponentType<{ schema: FieldSchema }>
}

const FieldRendererContext = createContext<FieldRendererContextValue | null>(null)

export function FieldRendererProvider ({
  children,
  RenderField,
}: {
  children: React.ReactNode
  RenderField: ComponentType<{ schema: FieldSchema }>
}) {
  return (
    <FieldRendererContext.Provider value={{ RenderField }}>
      {children}
    </FieldRendererContext.Provider>
  )
}

export function useFieldRenderer () {
  const context = useContext(FieldRendererContext)
  if (!context) {
    throw new Error('useFieldRenderer must be used within a FieldRendererProvider')
  }
  return context.RenderField
}
