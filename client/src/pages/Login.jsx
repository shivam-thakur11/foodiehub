import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, UtensilsCrossed, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  // If already logged in, redirect (using useEffect to avoid navigate-during-render)
  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, navigate, from])

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(er => ({ ...er, [k]: '' })) }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your FoodieHub account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-shadow ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-300'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-shadow ${errors.password ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-300'}`}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Demo accounts</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>User:</strong> user@foodiehub.com / user123</p>
              <p><strong>Admin:</strong> admin@foodiehub.com / admin123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-500 font-semibold hover:text-orange-600">Create one</Link>
        </p>
      </div>
    </div>
  )
}
