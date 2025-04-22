import App from './App.tsx'
import '@/styles/globals.scss'
import { scan } from 'react-scan'
import ReactDOM from 'react-dom/client'
import { Provider } from './provider.tsx'
import { BrowserRouter } from 'react-router-dom'

if (import.meta.env.MODE === 'development') {
  if (typeof window !== 'undefined') {
    scan({
      log: false,
    })
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter basename='/web/'>
    <Provider>
      <App />
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>,
)
