import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import api from '../../services/api'
import Modal from '../../components/common/Modal'
import { TableRowSkeleton } from '../../components/common/Skeleton'
import toast from 'react-hot-toast'

const STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Preparing: 'bg-orange-100 text-orange-700',
  'Out for Delivery': 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  // searchInput is what the user types; searchQuery is debounced and sent to the server
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Debounce: wait 400ms after the user stops typing before sending to server
  const debounceRef = useRef(null)
  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchInput(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchQuery(val)
      setPage(1)
    }, 400)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (statusFilter) params.status = statusFilter
      if (searchQuery.trim()) params.search = searchQuery.trim()
      const res = await api.get('/admin/orders', { params })
      setOrders(res.data.orders || [])
      setPagination(res.data.pagination || {})
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, searchQuery])

  useEffect(() => { load() }, [load])

  const handleStatusChange = async (orderId, status) => {
    setUpdatingStatus(true)
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status })
      toast.success(`Order marked as ${status}`)
      // Update in-place so the table reflects change immediately without full reload
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o)
      )
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(o => ({ ...o, orderStatus: status }))
      }
    } catch {
      toast.error('Status update failed')
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-500 text-sm mt-0.5">{pagination.total || 0} total orders</p>
      </div>

      {/* Filters — search is now server-side */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search by order ID or customer…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-700"
        >
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[750px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={8} />)
                : orders.length === 0
                  ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-gray-400">
                        {searchQuery ? `No orders matching "${searchQuery}"` : 'No orders found'}
                      </td>
                    </tr>
                  )
                  : orders.map(order => (
                    <tr key={order._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">
                        #{order._id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{order.user?.name || '—'}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[140px]">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{order.items?.length} item(s)</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">₹{order.totalAmount}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.orderStatus}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingStatus}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-orange-300 cursor-pointer disabled:cursor-not-allowed ${STATUS_COLORS[order.orderStatus]}`}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page <= 1}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 px-2">Page {page} of {pagination.pages}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= pagination.pages}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?._id?.slice(-8).toUpperCase()}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_COLORS[selectedOrder.orderStatus]}`}>
                {selectedOrder.orderStatus}
              </span>
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${selectedOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {selectedOrder.paymentStatus}
              </span>
              <span className="text-xs text-gray-400">{selectedOrder.paymentMethod}</span>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Customer</p>
              <p className="text-sm font-medium text-gray-800">{selectedOrder.user?.name}</p>
              <p className="text-xs text-gray-500">{selectedOrder.user?.email}</p>
              {selectedOrder.user?.phone && (
                <p className="text-xs text-gray-500">{selectedOrder.user.phone}</p>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Items</p>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">× {item.quantity} · ₹{item.price} each</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
              {[['Subtotal', selectedOrder.subtotal], ['Delivery', selectedOrder.deliveryFee], ['Tax', selectedOrder.tax]].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm text-gray-600">
                  <span>{l}</span><span>₹{v}</span>
                </div>
              ))}
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span><span>-₹{selectedOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200">
                <span>Total</span>
                <span className="text-orange-500">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Delivery Address</p>
              <p className="text-sm text-gray-700">
                {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city},{' '}
                {selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pincode}
              </p>
              {selectedOrder.deliveryAddress?.phone && (
                <p className="text-xs text-gray-500 mt-1">{selectedOrder.deliveryAddress.phone}</p>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selectedOrder._id, s)}
                    disabled={selectedOrder.orderStatus === s || updatingStatus}
                    className={`text-xs font-medium px-3 py-1.5 rounded-xl transition-colors ${selectedOrder.orderStatus === s
                      ? 'bg-orange-500 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
