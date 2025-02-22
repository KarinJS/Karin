import { Navigate, Route, Routes } from 'react-router-dom'
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
// import TestCanvas from '@/pages/dashboard/test'
import ChatDetail from '@/pages/dashboard/sandbox/chat/detail'
import DefaultPage from '@/components/default_page'
import FriendRequest from '@/pages/dashboard/sandbox/contact/friend_request'
import UserDetail from '@/pages/dashboard/sandbox/contact/detail'
import GroupNotice from '@/pages/dashboard/sandbox/contact/group_notice'
import GroupChatTest from '@/pages/dashboard/sandbox/group'
import RequireAuth from '@/components/auth/RequireAuth'
import PluginConfigPage from '@/pages/dashboard/plugins/config'

// Main App
function App () {
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
      </Route>
    </Routes>
  )
}

export default App
