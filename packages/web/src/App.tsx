import { Route, Routes } from 'react-router-dom'

import DashboardLayout from '@/pages/dashboard/layout'
import IndexPage from '@/pages/dashboard'
import ConfigPage from '@/pages/dashboard/config'
import LoginPage from '@/pages/login'
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<DashboardLayout />} path="/">
        <Route element={<IndexPage />} path="" />
        <Route element={<ConfigPage />} path="/config" />
      </Route>
    </Routes>
  )
}

export default App
