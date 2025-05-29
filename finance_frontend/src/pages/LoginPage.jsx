import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await login(username, password)
      navigate('/')
    } catch {
      setError('Неверный логин или пароль')
    }
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        elevation={6}
        sx={{ p: 4, width: '100%', borderRadius: 2 }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" component="h1">
            Вход в личный кабинет
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Логин"
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Пароль"
            type="password"
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, py: 1.5 }}
          >
            Войти
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
