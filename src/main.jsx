import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { ToastProvider } from './components/ToastProvider.jsx'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
            <App />
        </ThemeProvider>
      </ToastProvider>
    </Provider>
  </StrictMode>,
)
