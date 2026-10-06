import axios from 'axios'

// Normalize API URL:
// 1. If VITE_API_URL is provided, normalize trailing slashes and ensure /api path
// 2. Default to '/api' for local development with Vite proxy
let BASE_URL = (import.meta.env.VITE_API_URL || '/api').trim()

if (BASE_URL !== '/api') {
  BASE_URL = BASE_URL.replace(/\/+$/, '')
  // If the URL is an absolute HTTP/HTTPS URL and doesn't end with /api, append /api
  if (BASE_URL.startsWith('http') && !BASE_URL.endsWith('/api')) {
    BASE_URL += '/api'
  }
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30s timeout to accommodate Render free-tier cold starts
})

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fh_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On HTTP 401: clear stale credentials.
// Only redirect to /login if currently on a protected route to avoid jarring redirects on public pages.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !axios.isCancel(err)) {
      localStorage.removeItem('fh_token')
      localStorage.removeItem('fh_user')
      const isProtectedRoute = ['/checkout', '/profile', '/orders', '/admin'].some((p) =>
        window.location.pathname.startsWith(p)
      )
      if (isProtectedRoute && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
