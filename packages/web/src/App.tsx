import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
// Dashboard Page
// Layout
import DashboardLayout from '@/pages/dashboard/layout'
// HomePage
import IndexPage from '@/pages/dashboard'
// Config Page
import ConfigPage from '@/pages/dashboard/config'
// Plugin Market
import PluginMarketPage from '@/pages/dashboard/plugins'
// Sandbox Page
import SandboxPage from '@/pages/dashboard/sandbox'
// About Page
import AboutPage from '@/pages/dashboard/about'
// ----------
// Login Page
import LoginPage from '@/pages/login'
// Test Page
import ChatDetail from '@/pages/dashboard/sandbox/chat/detail'
import DefaultPage from '@/components/default_page'
import FriendRequest from '@/pages/dashboard/sandbox/contact/friend_request'
import UserDetail from '@/pages/dashboard/sandbox/contact/detail'
import GroupNotice from '@/pages/dashboard/sandbox/contact/group_notice'
import GroupChatTest from '@/pages/dashboard/sandbox/group'
import RequireAuth from '@/components/auth/RequireAuth'
import PluginConfigPage from '@/pages/dashboard/plugins/config'
// 404 Page
import NotFoundPage from '@/pages/404'
import { checkRequestTimeout } from './components/auth/back2Login'

// Main App
function App () {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined
    const startInterval = () => {
      intervalId = setInterval(() => {
        if (location.pathname !== '/web/login') {
          checkRequestTimeout(navigate)
        }
      }, 1000)
    }

    startInterval()

    return () => {
      clearInterval(intervalId)
    }
  }, [location, navigate])

  useEffect(() => {
    const path = location.pathname
    let title = '未知页面'

    switch (true) {
      case path === '/':
        title = '基础信息'
        break
      case path === '/config':
        title = '配置信息'
        break
      case path === '/plugins/list':
        title = '插件市场'
        break
      case path.startsWith('/plugins/'):
        title = '插件配置'
        break
      case path === '/sandbox':
        title = '沙箱调试'
        break
      case path.startsWith('/sandbox/chat'):
        title = '沙箱 | [聊天]'
        break
      case path.startsWith('/sandbox/contact'):
        title = '沙箱 | [联系人]'
        break
      case path === '/about':
        title = '关于我们'
        break
      case path === '/login':
        title = '登录'
        break
      default:
        title = '未知页面'
    }
    document.title = title += ' - Karin WebUI'
  }, [location])

  return (
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
        <Route element={<ConfigPage />} path='/config' />
        <Route element={<PluginMarketPage />} path='/plugins/list' />
        <Route element={<PluginConfigPage />} path='/plugins/:name' />
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
        <Route element={<AboutPage />} path='/about' />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
