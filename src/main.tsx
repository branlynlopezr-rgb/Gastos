import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/context/ThemeProvider'
import { AuthProvider } from '@/context/AuthProvider'
import { DataProvider } from '@/context/DataProvider'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
