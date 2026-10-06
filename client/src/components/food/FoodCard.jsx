import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Clock, Leaf } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const NEUTRAL_FOOD_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23f9fafb'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Cg fill='%239ca3af'%3E%3Ccircle cx='200' cy='130' r='45' fill='%23e5e7eb' stroke='%23d1d5db' stroke-width='3'/%3E%3Cpath d='M175 130c0-14 11-25 25-25s25 11 25 25-11 25-25 25-25-11-25-25z' fill='%23d1d5db'/%3E%3Crect x='160' y='190' width='80' height='8' rx='4' fill='%23d1d5db'/%3E%3C/g%3E%3Ctext x='50%25' y='230' font-family='system-ui, -apple-system, sans-serif' font-size='13' font-weight='600' fill='%239ca3af' text-anchor='middle'%3EFoodieHub%3C/text%3E%3C/svg%3E"

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

  return (
    <Link to={`/food/${food._id}`} className="group block h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={food.image || NEUTRAL_FOOD_FALLBACK}
            alt={food.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => {
              if (e.target.src !== NEUTRAL_FOOD_FALLBACK) {
                e.target.src = NEUTRAL_FOOD_FALLBACK
              }
            }}
          />
          {(food.isVegetarian || food.isVeg) && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Leaf className="w-2.5 h-2.5" /> Veg
            </div>
          )}
          {food.isFeatured && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Popular
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {food.category?.name && (
              <p className="text-xs text-orange-500 font-semibold mb-1 tracking-wide">
                {food.category.name}
              </p>
            )}
            <h3 className="font-semibold text-gray-900 mb-1 text-base leading-snug line-clamp-2 min-h-[2.5rem]">
              {food.name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
              {food.description}
            </p>
          </div>

          <div>
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

            <div className="flex items-center justify-between pt-1 border-t border-gray-50">
              <span className="text-lg font-bold text-gray-900">₹{food.price}</span>
              <button
                type="button"
                onClick={handleAdd}
                disabled={adding}
                aria-label={`Add ${food.name} to cart`}
                className={`flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-xl transition-all duration-200 ${inCart
                    ? 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow'
                  } disabled:opacity-70 cursor-pointer`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {inCart ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
