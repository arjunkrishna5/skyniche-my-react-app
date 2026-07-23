import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from './contents/AuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider maxSnack={3} autoHideDuration={1000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>,
)
