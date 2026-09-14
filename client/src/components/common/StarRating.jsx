import React from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, max = 5, size = 'sm', showValue = true }) {
  const s = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={`${s} ${i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
          />
        ))}
      </div>
      {showValue && <span className="text-xs font-medium text-gray-600">{rating.toFixed(1)}</span>}
    </div>
  )
}
