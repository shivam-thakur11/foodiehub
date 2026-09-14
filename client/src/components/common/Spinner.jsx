import React from 'react'

export default function Spinner({ size = 'md', color = 'orange' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  const colors = { orange: 'border-orange-500', white: 'border-white', gray: 'border-gray-400' }
  return (
    <div className={`${sizes[size]} rounded-full border-2 ${colors[color]} border-t-transparent animate-spin`} />
  )
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner size="lg" />
    </div>
  )
}
