import React from 'react'
import { UtensilsCrossed } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
            <UtensilsCrossed className="w-7 h-7 text-orange-500" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">FoodieHub</h1>
          <p className="text-sm text-gray-400 mt-1">Loading…</p>
        </div>
      </div>
    </div>
  )
}
