import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, CreditCard, CheckCircle, Circle, Clock, Package } from 'lucide-react'
import api from '../services/api'
import { PageSpinner } from '../components/common/Spinner'

const STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered']

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Preparing: 'bg-orange-100 text-orange-700',
  'Out for Delivery': 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data.order))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageSpinner />
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found.</div>

  const isCancelled = order.orderStatus === 'Cancelled'
  const currentIdx = STATUSES.indexOf(order.orderStatus)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-400 mt-1">
            #{order._id?.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
          {order.orderStatus}
        </span>
      </div>

      {/* Order Tracker */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" /> Order Tracking
          </h2>
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 z-0" />
            <div
              className="absolute top-4 left-4 h-0.5 bg-orange-500 z-0 transition-all duration-500"
              style={{ width: currentIdx <= 0 ? '0%' : `${(currentIdx / (STATUSES.length - 1)) * 100}%` }}
            />
            <div className="relative z-10 flex justify-between">
              {STATUSES.map((status, idx) => {
                const done = idx <= currentIdx
                return (
                  <div key={status} className="flex flex-col items-center gap-2 flex-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-200 bg-white text-gray-300'}`}>
                      {done ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] font-semibold leading-tight ${done ? 'text-orange-500' : 'text-gray-400'}`}>
                        {status.replace('Out for ', '')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Package className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 font-medium">This order has been cancelled.</p>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">Items Ordered</h2>
        <div className="space-y-3 mb-5">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.image && (
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400">× {item.quantity} · ₹{item.price} each</p>
              </div>
              <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-4 space-y-2">
          {[['Subtotal', order.subtotal], ['Delivery Fee', order.deliveryFee], ['Tax', order.tax]].map(([label, val]) => (
            <div key={label} className="flex justify-between text-sm text-gray-600">
              <span>{label}</span><span>₹{val}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
            <span>Total</span><span className="text-orange-500">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Delivery + Payment */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" /> Delivery Address
          </h3>
          <p className="text-sm text-gray-600">{order.deliveryAddress?.label}</p>
          <p className="text-sm text-gray-600">{order.deliveryAddress?.street}</p>
          <p className="text-sm text-gray-600">{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
          <p className="text-sm text-gray-600">{order.deliveryAddress?.pincode}</p>
          {order.deliveryAddress?.phone && <p className="text-sm text-gray-500 mt-1">{order.deliveryAddress.phone}</p>}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-orange-500" /> Payment Info
          </h3>
          <p className="text-sm text-gray-600">Method: <span className="font-medium text-gray-800">{order.paymentMethod}</span></p>
          <p className="text-sm text-gray-600 mt-1">Status:
            <span className={`ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {order.paymentStatus}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
