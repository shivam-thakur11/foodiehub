import React, { useEffect, useState, useCallback } from 'react'
import { Search, Shield, User, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react'
import api from '../../services/api'
import { TableRowSkeleton } from '../../components/common/Skeleton'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [updating, setUpdating] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (search) params.search = search
      const res = await api.get('/admin/users', { params })
      setUsers(res.data.users || [])
      setPagination(res.data.pagination || {})
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { load() }, [load])

  const handleRoleToggle = async (u) => {
    if (u._id === currentUser._id) { toast.error("Can't change your own role"); return }
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    setUpdating(u._id)
    try {
      await api.put(`/admin/users/${u._id}/role`, { role: newRole })
      setUsers(prev => prev.map(usr => usr._id === u._id ? { ...usr, role: newRole } : usr))
      toast.success(`Role updated to ${newRole}`)
    } catch { toast.error('Update failed') }
    finally { setUpdating(null) }
  }

  const handleToggleStatus = async (u) => {
    if (u._id === currentUser._id) { toast.error("Can't deactivate yourself"); return }
    setUpdating(u._id)
    try {
      await api.put(`/admin/users/${u._id}/toggle-status`)
      setUsers(prev => prev.map(usr => usr._id === u._id ? { ...usr, isActive: !usr.isActive } : usr))
      toast.success(`User ${u.isActive ? 'deactivated' : 'activated'}`)
    } catch { toast.error('Update failed') }
    finally { setUpdating(null) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm mt-0.5">{pagination.total || 0} registered users</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                : users.length === 0
                  ? <tr><td colSpan={7} className="text-center py-10 text-gray-400">No users found</td></tr>
                  : users.map(u => (
                    <tr key={u._id} className={`border-b border-gray-50 last:border-0 transition-colors ${!u.isActive ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${u.role === 'admin' ? 'bg-purple-100' : 'bg-orange-100'}`}>
                            <span className={`text-xs font-bold ${u.role === 'admin' ? 'text-purple-600' : 'text-orange-600'}`}>{u.name?.[0]?.toUpperCase()}</span>
                          </div>
                          <span className="font-medium text-gray-900 max-w-[120px] truncate">{u.name}</span>
                          {u._id === currentUser._id && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">You</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate">{u.email}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{u.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        {u._id !== currentUser._id && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRoleToggle(u)}
                              disabled={updating === u._id}
                              title={u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-colors disabled:opacity-50"
                            >
                              <Shield className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(u)}
                              disabled={updating === u._id}
                              title={u.isActive ? 'Deactivate' : 'Activate'}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors disabled:opacity-50"
                            >
                              {u.isActive ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-gray-300" />}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => p - 1)} disabled={page <= 1} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 px-2">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= pagination.pages} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
