import clsx from 'clsx'
import { type ReactNode, createContext, forwardRef, useContext } from 'react'

export interface TabsContextValue {
  activeKey: string
  onChange: (key: string) => void
}

const TabsContext = createContext<TabsContextValue>({
  activeKey: '',
  onChange: () => { }
})

export interface TabsProps {
  activeKey: string
  onChange: (key: string) => void
  children: ReactNode
  className?: string
}

export function Tabs ({ activeKey, onChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ activeKey, onChange }}>
      <div className={clsx('flex flex-col', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface TabListProps {
  children: ReactNode
  className?: string
}

export function TabList ({ children, className }: TabListProps) {
  return (
    <div role='tablist' className={clsx('flex items-center pt-2', className)}>{children}</div>
  )
}

export interface TabProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  value: string
  className?: string
  children: ReactNode
  isSelected?: boolean
}

export const Tab = forwardRef<HTMLDivElement, TabProps>(
  ({ className, isSelected, value, ...props }, ref) => {
    const { onChange } = useContext(TabsContext)

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onChange(value)
      props.onClick?.(e)
    }

    return (
      <div
        ref={ref}
        role='tab'
        aria-selected={isSelected === true}
        onClick={handleClick}
        className={clsx(
          'px-3 py-1 flex items-center gap-1 text-sm font-medium transition-all rounded-t-md',
          isSelected
            ? 'border-b-2 border-primary text-primary bg-primary/5'
            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800',
          className
        )}
        {...props}
      />
    )
  }
)

Tab.displayName = 'Tab'

export interface TabPanelProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabPanel ({ value, children, className }: TabPanelProps) {
  const { activeKey } = useContext(TabsContext)
  const isActive = value === activeKey

  return (
    <div
      role='tabpanel'
      aria-hidden={!isActive}
      className={clsx('flex-1 bg-[#0C0C0C] border-l border-r border-b border-gray-600', className, {
        hidden: !isActive
      })}
    >
      {isActive ? children : null}
    </div>
  )
}
