import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { Provider } from './provider.tsx'
import '@/styles/globals.scss'

if (import.meta.env.MODE === 'development') {
  if (typeof window !== 'undefined') {
    import('react-scan').then(({ scan }) => {
      scan({
        log: true,
      })
    })
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/web/">
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
