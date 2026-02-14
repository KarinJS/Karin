import { clsx } from 'clsx'

interface SidebarItemProps {
  id: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any
  count?: number
  activeFilter: string
  setActiveFilter: (id: string) => void
}

export const SidebarItem = ({ 
  id, 
  label, 
  icon: Icon, 
  count, 
  activeFilter, 
  setActiveFilter 
}: SidebarItemProps) => {
  
  // Try to translate label if possible, otherwise use as is
  // This handles both static keys and dynamic tags
  const translatedLabel = id === 'all' || id === 'installed' || id === 'npm' || id === 'url' 
    ? label // These are already translated in parent
    : label // For tags, we might just use the raw tag name for now

  return (
  <button
    onClick={() => setActiveFilter(id)}
    className={clsx(
      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 group text-left",
      activeFilter === id 
        ? "bg-white shadow-sm text-slate-900 dark:bg-zinc-800 dark:text-slate-100" 
        : "text-slate-500 hover:bg-white/40 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
    )}
  >
    <div className="flex items-center gap-3">
      {Icon && (
        <Icon 
          size={16} 
          className={clsx(
            activeFilter === id 
              ? "text-slate-900 dark:text-slate-100" 
              : "text-slate-400 group-hover:text-slate-600 dark:text-zinc-500"
          )} 
        />
      )}
      <span>{translatedLabel}</span>
    </div>
    {count !== undefined && (
      <span className={clsx(
        "text-[10px] px-1.5 py-0.5 rounded-md transition-colors font-bold",
        activeFilter === id 
          ? "bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-slate-400" 
          : "bg-slate-100/50 dark:bg-zinc-800/50 text-slate-400 group-hover:bg-slate-200"
      )}>
        {count}
      </span>
    )}
  </button>
)}
