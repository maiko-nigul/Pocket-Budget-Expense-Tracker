import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'
import App from './App.tsx'

const heading = "'Poppins', system-ui, 'Segoe UI', Roboto, sans-serif"

const theme = createTheme({
  palette: { mode: 'dark', background: { default: '#000', paper: '#111' } },
  typography: {
    h1: { fontFamily: heading, fontSize: '25px' },
    h2: { fontFamily: heading, fontSize: '25px' },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
