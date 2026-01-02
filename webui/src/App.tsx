import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from './layouts/DashboardLayout'
import { Dashboard } from './pages/Dashboard'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="*" element={<div className="p-6">Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
