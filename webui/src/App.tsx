import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { HeroUIProvider } from '@heroui/react'
import { Toaster } from 'sonner'
import { DashboardLayout } from './layouts/DashboardLayout'
import { Dashboard } from './pages/Dashboard'
import { Plugins } from './pages/Plugins'
import { PluginManage } from './pages/PluginManage'
import { PluginCustom } from './pages/PluginCustom'
import { Settings } from './pages/Settings'
import { SchemaDemo } from './pages/SchemaDemo'
import { PluginConfig } from './pages/PluginConfig'
import { Login } from './pages/Login'
import { Activity } from './pages/Activity'
import { AuthGuard } from './components/AuthGuard'

function AppRoutes () {
  const navigate = useNavigate()
  return (
    <HeroUIProvider navigate={navigate}>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route index element={<Dashboard />} />
          <Route path="plugins" element={<Plugins />} />
          <Route path="plugin-manage" element={<PluginManage />} />
          <Route path="plugin-custom" element={<PluginCustom />} />
          <Route path="settings" element={<Settings />} />
          <Route path="schema-demo" element={<SchemaDemo />} />
          <Route path="plugin-config" element={<PluginConfig />} />
          <Route path="activity" element={<Activity />} />
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
