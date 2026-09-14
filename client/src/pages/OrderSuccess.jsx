import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react'
import api from '../services/api'
import { PageSpinner } from '../components/common/Spinner'

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data.order))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed! 🎉</h1>
      <p className="text-gray-500 mb-2">Your delicious food is on its way!</p>
      {order && <p className="text-sm text-gray-400 mb-8">Order ID: <span className="font-mono font-semibold text-gray-600">#{order._id?.slice(-8).toUpperCase()}</span></p>}

      {order && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left mb-6">
          {/* Items */}
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-orange-500" /> Ordered Items</h3>
          <div className="space-y-3 mb-5">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.image && <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100"><img src={item.image} className="w-full h-full object-cover" alt={item.name} /></div>}
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">× {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
            <div className="flex justify-between text-sm text-gray-600"><span>Delivery</span><span>₹{order.deliveryFee}</span></div>
            <div className="flex justify-between text-sm text-gray-600"><span>Tax</span><span>₹{order.tax}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
              <span>Total</span><span className="text-orange-500">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Delivery + Payment */}
          <div className="mt-5 pt-5 border-t border-gray-100 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Delivery To</p>
              <p className="text-sm text-gray-700">{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</p>
              <p className="text-sm text-gray-700">{order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5 flex items-center gap-1"><CreditCard className="w-3 h-3" /> Payment</p>
              <p className="text-sm text-gray-700">{order.paymentMethod}</p>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={`/orders/${id}`} className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-2xl transition-colors">
          Track Order
        </Link>
        <Link to="/menu" className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-2xl transition-colors">
          Order More
        </Link>
      </div>
    </div>
  )
}
