import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const DELIVERY_FEE = 40
const TAX_RATE = 0.05

export default function Cart() {
  const { items, removeFromCart, updateQty, subtotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const tax = +(subtotal * TAX_RATE).toFixed(2)
  const total = subtotal + DELIVERY_FEE + tax
  const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='%23f3f4f6'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ccircle cx='100' cy='90' r='35' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='160' font-family='system-ui, sans-serif' font-size='12' fill='%239ca3af' text-anchor='middle'%3EFoodieHub%3C/text%3E%3C/svg%3E"

  const handleCheckout = () => {
    if (!user) { navigate('/login', { state: { from: { pathname: '/checkout' } } }); return }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-sm">Add something from the menu to get started.</p>
        <Link to="/menu" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
          <ShoppingBag className="w-4 h-4" /> Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Your Cart <span className="text-orange-500 text-xl font-semibold">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ food, quantity }) => (
            <div key={food._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 p-4">
              <Link to={`/food/${food._id}`} className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <img src={food.image || fallback} alt={food.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = fallback }} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/food/${food._id}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-orange-500 transition-colors truncate">{food.name}</h3>
                </Link>
                <p className="text-sm text-gray-400 truncate">{food.category?.name || ''}</p>
                <p className="text-base font-bold text-orange-500 mt-1">₹{food.price}</p>
              </div>
              <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => updateQty(food._id, quantity - 1)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center text-sm font-bold text-gray-900">{quantity}</span>
                <button onClick={() => updateQty(food._id, quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="font-bold text-gray-900">₹{food.price * quantity}</p>
                <button onClick={() => removeFromCart(food._id)}
                  className="mt-1 p-1 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-900">₹{DELIVERY_FEE}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (5%)</span>
                <span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-100 my-2" />
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-orange-500">₹{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-start gap-2 mb-5">
              <Tag className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-orange-700">Use code <strong>WELCOME20</strong> at checkout for 20% off!</p>
            </div>
            <button onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-2xl transition-colors text-base shadow-sm">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/menu" className="block text-center mt-3 text-sm text-gray-500 hover:text-orange-500 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
