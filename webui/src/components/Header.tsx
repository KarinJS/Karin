import { Bell, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Header () {
  const { t } = useTranslation()

  return (
    <header className="h-20 flex items-center justify-between px-8 pt-4">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full group">
          <div className="absolute inset-0 bg-sky-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative glass-panel rounded-xl flex items-center px-4 py-2.5 transition-all duration-300 group-hover:bg-white/80">
            <Search className="text-slate-400 mr-3" size={18} />
            <input
              type="text"
              placeholder={t('common.search')}
              className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-3 glass-panel rounded-full text-slate-500 hover:text-sky-500 hover:bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
        </button>
      </div>
    </header>
  )
}
