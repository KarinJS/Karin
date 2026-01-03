import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { HeroUIProvider } from '@heroui/react'
import { Toaster } from 'sonner'
import { DashboardLayout } from './layouts/DashboardLayout'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { BasicConfig } from './pages/BasicConfig'

function AppRoutes () {
  const navigate = useNavigate()
  return (
    <HeroUIProvider navigate={navigate}>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="basic-config" element={<BasicConfig />} />
          <Route path="*" element={<div className="p-6">Page not found</div>} />
        </Route>
      </Routes>
    </HeroUIProvider>
  )
}

function App () {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
