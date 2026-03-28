import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import FilesPage from './pages/Files'
import Login from './pages/Login'

export default function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="files" element={<FilesPage />} />
          {/* We can add more routes here later */}
          <Route path="*" element={<div className="flex items-center justify-center h-full text-default-500">Page not found or under construction</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
