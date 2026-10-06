import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, Banknote, Smartphone, ChevronDown, ChevronUp, Plus, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const DELIVERY_FEE = 40
const TAX_RATE = 0.05

const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when your order arrives' },
  { value: 'CARD', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Test mode — no real charge' },
  { value: 'UPI', label: 'UPI', icon: Smartphone, desc: 'Test mode — no real charge' },
]

const emptyAddr = { label: 'Home', street: '', city: '', state: '', pincode: '', phone: '' }

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const savedAddrs = user?.addresses || []
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(savedAddrs.length > 0 ? 0 : -1)
  const [showNewAddr, setShowNewAddr] = useState(savedAddrs.length === 0)
  const [newAddr, setNewAddr] = useState(emptyAddr)
  const [payment, setPayment] = useState('COD')
  const [placing, setPlacing] = useState(false)
  const [errors, setErrors] = useState({})
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState('')

  const tax = +(subtotal * TAX_RATE).toFixed(2)
  const total = subtotal + DELIVERY_FEE + tax - discount

  if (items.length === 0) {
    navigate('/cart'); return null
  }

  const validate = () => {
    const addr = showNewAddr || selectedAddrIdx === -1 ? newAddr : savedAddrs[selectedAddrIdx]
    const e = {}
    if (!addr?.street?.trim()) e.street = 'Street is required'
    if (!addr?.city?.trim()) e.city = 'City is required'
    if (!addr?.state?.trim()) e.state = 'State is required'
    if (!addr?.pincode?.trim()) e.pincode = 'Pincode is required'
    if (!addr?.phone?.trim()) e.phone = 'Phone is required'
    return e
  }

  const handlePlaceOrder = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); toast.error('Please fill in delivery address'); return }

    const deliveryAddress = showNewAddr || selectedAddrIdx === -1 ? newAddr : savedAddrs[selectedAddrIdx]
    const orderItems = items.map(i => ({ foodId: i.food._id, quantity: i.quantity }))

    setPlacing(true)
    try {
      const res = await api.post('/orders', {
        items: orderItems,
        deliveryAddress,
        paymentMethod: payment,
        couponCode: appliedCoupon || undefined,
      })
      clearCart()
      toast.success('Order placed successfully.')
      navigate(`/order-success/${res.data.order._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally { setPlacing(false) }
  }

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase()
    if (!code) {
      toast.error('Please enter a coupon code')
      return
    }

    // Client-side validation matching server-side
    const validCoupons = {
      'WELCOME20': { type: 'percentage', value: 20, minOrder: 0 },
      'SAVE50': { type: 'fixed', value: 50, minOrder: 200 },
      'FLAT100': { type: 'fixed', value: 100, minOrder: 500 },
    }

    const coupon = validCoupons[code]
    if (!coupon) {
      toast.error('Invalid coupon code')
      return
    }

    if (subtotal < coupon.minOrder) {
      toast.error(`Minimum order of ₹${coupon.minOrder} required`)
      return
    }

    let discountAmount = 0
    if (coupon.type === 'percentage') {
      discountAmount = parseFloat(((subtotal * coupon.value) / 100).toFixed(2))
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.value
    }

    setDiscount(discountAmount)
    setAppliedCoupon(code)
    toast.success(`Coupon applied! You saved ₹${discountAmount}`)
  }

  const handleRemoveCoupon = () => {
    setDiscount(0)
    setAppliedCoupon('')
    setCouponCode('')
    toast.success('Coupon removed')
  }

  const setNew = (k, v) => { setNewAddr(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Address + Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" /> Delivery Address
            </h2>

            {savedAddrs.length > 0 && (
              <div className="space-y-3 mb-4">
                {savedAddrs.map((addr, idx) => (
                  <label key={idx} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddrIdx === idx && !showNewAddr ? 'border-orange-300 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="address" checked={selectedAddrIdx === idx && !showNewAddr}
                      onChange={() => { setSelectedAddrIdx(idx); setShowNewAddr(false) }} className="mt-0.5 text-orange-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{addr.label}</p>
                      <p className="text-sm text-gray-500">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      {addr.phone && <p className="text-xs text-gray-400 mt-0.5">{addr.phone}</p>}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* New address toggle */}
            <button onClick={() => { setShowNewAddr(v => !v); if (!showNewAddr) setSelectedAddrIdx(-1) }}
              className="flex items-center gap-2 text-sm text-orange-500 font-medium hover:text-orange-600 transition-colors mb-3">
              <Plus className="w-4 h-4" />
              {showNewAddr ? 'Cancel' : 'Add a new address'}
              {showNewAddr ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {(showNewAddr || savedAddrs.length === 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Address Type</label>
                  <div className="flex gap-2">
                    {['Home', 'Work', 'Other'].map(t => (
                      <button key={t} type="button" onClick={() => setNew('label', t)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors ${newAddr.label === t ? 'bg-orange-50 border-orange-300 text-orange-600' : 'border-gray-200 text-gray-600'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Street / House No.</label>
                  <input value={newAddr.street} onChange={e => setNew('street', e.target.value)} placeholder="123, Main Street"
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${errors.street ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-300'} bg-white`} />
                  {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
                </div>
                {[['city', 'City', 'Mumbai'], ['state', 'State', 'Maharashtra'], ['pincode', 'Pincode', '400001'], ['phone', 'Phone', '9876543210']].map(([key, label, ph]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{label}</label>
                    <input value={newAddr[key]} onChange={e => setNew(key, e.target.value)} placeholder={ph}
                      className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${errors[key] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-300'} bg-white`} />
                    {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" /> Payment Method
            </h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(({ value, label, icon: Icon, desc }) => (
                <label key={value} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${payment === value ? 'border-orange-300 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value={value} checked={payment === value}
                    onChange={() => setPayment(value)} className="text-orange-500" />
                  <Icon className={`w-5 h-5 ${payment === value ? 'text-orange-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5 max-h-52 overflow-y-auto">
              {items.map(({ food, quantity }) => (
                <div key={food._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover"
                      onError={e => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23f3f4f6'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ccircle cx='50' cy='50' r='20' fill='%23e5e7eb'/%3E%3C/svg%3E" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{food.name}</p>
                    <p className="text-xs text-gray-400">× {quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 flex-shrink-0">₹{food.price * quantity}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span><span className="font-medium text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span><span className="font-medium text-gray-900">₹{DELIVERY_FEE}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (5%)</span><span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Discount ({appliedCoupon})</span><span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span><span className="text-orange-500 text-lg">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Input */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Have a coupon?
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-green-700">{appliedCoupon}</span>
                    <span className="text-xs text-green-600">applied</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:text-red-600 font-medium">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 uppercase"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">Try: WELCOME20, SAVE50, FLAT100</p>
            </div>

            <button onClick={handlePlaceOrder} disabled={placing}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-semibold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-sm">
              {placing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing order...</> : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
