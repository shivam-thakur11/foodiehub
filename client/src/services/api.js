import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fh_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On HTTP 401: clear stale credentials and redirect to login.
// Ignore cancelled/aborted requests (the auth-check on mount uses AbortController).
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !axios.isCancel(err)) {
      localStorage.removeItem('fh_token')
      localStorage.removeItem('fh_user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
