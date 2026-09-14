import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Clock, Leaf } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function FoodCard({ food }) {
  const { addToCart, items } = useCart()
  const [adding, setAdding] = useState(false)
  const inCart = items.find(i => String(i.food._id) === String(food._id))

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    addToCart(food)
    setTimeout(() => setAdding(false), 600)
  }

  const fallback = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'

  return (
    <Link to={`/food/${food._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={food.image || fallback}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.src = fallback }}
          />
          {food.isVegetarian && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Leaf className="w-2.5 h-2.5" /> Veg
            </div>
          )}
          {food.isFeatured && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Popular
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-orange-500 font-medium mb-1 truncate">
            {food.category?.name || 'Food'}
          </p>
          <h3 className="font-semibold text-gray-900 mb-1 truncate">{food.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{food.description}</p>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-gray-700">{food.rating?.toFixed(1) || '4.5'}</span>
            </div>
            {food.preparationTime && (
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{food.preparationTime}m</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">₹{food.price}</span>
            <button
              onClick={handleAdd}
              disabled={adding}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl transition-all duration-200 ${inCart
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
                } disabled:opacity-70`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {inCart ? 'In Cart' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
