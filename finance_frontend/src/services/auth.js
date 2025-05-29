import api from './api'

export async function login(username, password) {
  const response = await api.post('token/', { username, password })
  localStorage.setItem('access', response.data.access)
  localStorage.setItem('refresh', response.data.refresh)
  return response
}

export function logout() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}
