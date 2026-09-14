import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fh_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  // Verify token on mount — use short timeout so a downed server never
  // blocks the whole app for 15 seconds (the global axios timeout).
  useEffect(() => {
    const token = localStorage.getItem('fh_token')
    if (token) {
      // AbortController lets us cancel after 5 s regardless of axios timeout
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 5000)
      api.get('/auth/me', { signal: controller.signal })
        .then(res => setUser(res.data.user))
        .catch(() => {
          // Network failure or invalid token — clear stale credentials
          localStorage.removeItem('fh_token')
          localStorage.removeItem('fh_user')
          setUser(null)
        })
        .finally(() => { clearTimeout(timer); setLoading(false) })
    } else {
      setLoading(false)
    }
  }, [])

  const register = async (data) => {
    const res = await api.post('/auth/register', data)
    localStorage.setItem('fh_token', res.data.token)
    localStorage.setItem('fh_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    toast.success('Welcome to FoodieHub!')
    return res.data
  }

  const login = async (data) => {
    const res = await api.post('/auth/login', data)
    localStorage.setItem('fh_token', res.data.token)
    localStorage.setItem('fh_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('fh_token')
    localStorage.removeItem('fh_user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('fh_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
