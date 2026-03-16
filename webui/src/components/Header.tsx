import { useTranslation } from 'react-i18next'

export function Header () {
  const { t } = useTranslation()

  return (
    <header className="h-20 flex items-center justify-between px-8 pt-4">
      <div className="flex items-center gap-4 w-96">
        {/* Search removed */}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications removed */}
      </div>
    </header>
  )
}
