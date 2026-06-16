import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/context/ThemeProvider'
import { DataProvider } from '@/context/DataProvider'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </ThemeProvider>
  </StrictMode>,
)
