import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12 }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 8 }
      }
    }
  }
})


const container = document.getElementById('root')

const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
