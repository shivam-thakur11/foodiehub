import React from 'react'

function Bone({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
}

export function FoodCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <Bone className="h-48 rounded-none" />
      <div className="p-4 space-y-3">
        <Bone className="h-3 w-16" />
        <Bone className="h-5 w-3/4" />
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <Bone className="h-6 w-16" />
          <Bone className="h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Bone className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export default Bone
