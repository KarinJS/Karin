import { Button } from "@heroui/react"
import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SaveButtonProps {
  saving: boolean
  onPress: () => void
}

/**
 * 保存按钮组件
 */
export function SaveButton ({ saving, onPress }: SaveButtonProps) {
  const { t } = useTranslation()

  return (
    <Button
      color="primary"
      isLoading={saving}
      startContent={!saving && <Save size={18} />}
      onPress={onPress}
    >
      {t('common.saveChanges', '保存更改')}
    </Button>
  )
}
