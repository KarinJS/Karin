import { useEffect, Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import RequireAuth from '@/components/auth/RequireAuth'
import { getPageTitle } from '@/lib/utils'
import ScrollToTop from './components/common/ScrollToTop'

const LoadingPage = lazy(() => import('@/pages/loading'))
const DashboardLayout = lazy(() => import('@/pages/dashboard/layout'))
const IndexPage = lazy(() => import('@/pages/dashboard'))
const ConfigPage = lazy(() => import('@/pages/dashboard/config/index'))
const PluginMarketPage = lazy(() => import('@/pages/dashboard/plugins'))
const PluginConfigPage = lazy(() => import('@/pages/dashboard/plugins/config'))
const PluginManagePage = lazy(() => import('@/pages/dashboard/plugins/manage'))
const AboutPage = lazy(() => import('@/pages/dashboard/about'))
const LoginPage = lazy(() => import('@/pages/login'))
const NotFoundPage = lazy(() => import('@/pages/404'))
const LogPage = lazy(() => import('@/pages/dashboard/log'))
const TerminalPage = lazy(() => import('@/pages/dashboard/terminal'))
const WebUIPluginPage = lazy(() => import('@/pages/dashboard/plugin/webui'))
const DependenciesPage = lazy(() => import('@/pages/dashboard/dependencies/dependencies'))

// Main App
function App () {
  const location = useLocation()

  useEffect(() => {
    document.title = getPageTitle(location.pathname) + ' - Karin WebUI | 永远相信美好的事情即将发生'
  }, [location])

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
          path='/'
        >
          <Route element={<IndexPage />} path='' />
          <Route element={<TerminalPage />} path='/terminal' />
          <Route element={<WebUIPluginPage />} path='/plugins/webui' />
          <Route element={<DependenciesPage />} path='/dependencies' />
          <Route element={<ConfigPage />} path='/config/*'>
            <Route element={<Navigate to='/config/system' />} path='' />
            <Route element={<ConfigPage />} path=':tab' />
          </Route>
          <Route element={<PluginMarketPage />} path='/plugins/list' />
          <Route element={<PluginConfigPage />} path='/plugins/config' />
          <Route element={<PluginManagePage />} path='/plugins/manage' />
          <Route element={<LogPage />} path='/log' />
          <Route element={<AboutPage />} path='/about' />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ScrollToTop />
    </Suspense>
  )
}

export default App
