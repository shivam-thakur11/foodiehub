import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('fh_cart')) || [] } catch { return [] }
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem('fh_cart', JSON.stringify(items))
  }, [items])

  const addToCart = (food, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => String(i.food._id) === String(food._id))
      if (existing) {
        toast.success('Quantity updated!')
        return prev.map(i => String(i.food._id) === String(food._id) ? { ...i, quantity: i.quantity + qty } : i)
      }
      toast.success('Added to cart!')
      return [...prev, { food, quantity: qty }]
    })
  }

  const removeFromCart = (foodId) => {
    setItems(prev => prev.filter(i => String(i.food._id) !== String(foodId)))
    toast.success('Item removed')
  }

  const updateQty = (foodId, qty) => {
    if (qty <= 0) { removeFromCart(foodId); return }
    setItems(prev => prev.map(i => String(i.food._id) === String(foodId) ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => setItems([])

  const cartCount = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => s + i.food.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, cartCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
