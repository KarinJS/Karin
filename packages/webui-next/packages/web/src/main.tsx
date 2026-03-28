// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toast } from '@heroui/react'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <div>
    <Toast.Provider placement="top" />
    <App />
  </div>

  // </StrictMode>
)
