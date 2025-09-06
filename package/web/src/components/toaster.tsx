import { Toaster as HotToaster } from 'react-hot-toast'
import { useTheme } from '@/hooks/use-theme'

export const Toaster = () => {
  const { isDark } = useTheme()

  return (
    <HotToaster
      toastOptions={{
        style: {
          borderRadius: '20px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
          zIndex: 10000,
        },
      }}
      containerStyle={{
        zIndex: 10000,
      }}
    />
  )
}

export default Toaster
