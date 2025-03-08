import { useEffect, Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import RequireAuth from '@/components/auth/RequireAuth'
import { getPageTitle } from '@/lib/utils'
import ScrollToTop from './components/common/ScrollToTop'

// 使用lazy动态导入页面组件
const DashboardLayout = lazy(() => import('@/pages/dashboard/layout'))
const IndexPage = lazy(() => import('@/pages/dashboard'))
const ConfigPage = lazy(() => import('@/pages/dashboard/config/index'))
const PluginMarketPage = lazy(() => import('@/pages/dashboard/plugins'))
const SandboxPage = lazy(() => import('@/pages/dashboard/sandbox'))
const AboutPage = lazy(() => import('@/pages/dashboard/about'))
const LoginPage = lazy(() => import('@/pages/login'))
const ChatDetail = lazy(() => import('@/pages/dashboard/sandbox/chat/detail'))
const DefaultPage = lazy(() => import('@/components/default_page'))
const FriendRequest = lazy(() => import('@/pages/dashboard/sandbox/contact/friend_request'))
const UserDetail = lazy(() => import('@/pages/dashboard/sandbox/contact/detail'))
const GroupNotice = lazy(() => import('@/pages/dashboard/sandbox/contact/group_notice'))
const GroupChatTest = lazy(() => import('@/pages/dashboard/sandbox/group'))
const PluginConfigPage = lazy(() => import('@/pages/dashboard/plugins/config'))
const NotFoundPage = lazy(() => import('@/pages/404'))
const LogPage = lazy(() => import('@/pages/dashboard/log'))

// Main App
function App () {
  const location = useLocation()

  useEffect(() => {
    document.title = getPageTitle(location.pathname) + ' - Karin WebUI | 永远相信美好的事情即将发生'
  }, [location])

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
          <Route element={<ConfigPage />} path='/config/*'>
            <Route element={<Navigate to='/config/system' />} path='' />
            <Route element={<ConfigPage />} path=':tab' />
          </Route>
          <Route element={<PluginMarketPage />} path='/plugins/list' />
          <Route element={<PluginConfigPage />} path='/plugins/config' />
          <Route element={<SandboxPage />} path='/sandbox'>
            <Route element={<Navigate to='/sandbox/chat' />} path='' />
            <Route path='chat'>
              <Route element={<DefaultPage />} path='' />
              <Route element={<ChatDetail />} path=':type/:id' />
            </Route>
            <Route path='contact/*'>
              <Route element={<DefaultPage />} path='' />
              <Route element={<FriendRequest />} path='friend_request' />
              <Route element={<GroupNotice />} path='group_notice' />
              <Route element={<UserDetail />} path=':id' />
            </Route>
            <Route element={<GroupChatTest />} path='group' />
          </Route>
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
