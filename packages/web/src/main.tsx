import { scan } from 'react-scan'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { Provider } from './provider.tsx'
import '@/styles/globals.scss'
import ConsoleMessage from './components/ConsoleMessage.tsx'

if (import.meta.env.MODE === 'development') {
  if (typeof window !== 'undefined') {
    scan({
      log: false,
    })
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename='/web/'>
      <Provider>
        <ConsoleMessage />
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
