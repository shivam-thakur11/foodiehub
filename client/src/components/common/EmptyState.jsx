import React from 'react'
import { Link } from 'react-router-dom'

export default function EmptyState({ icon, title, description, actionLabel, actionTo, onAction }) {
  const btnClass =
    'inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm'

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-gray-500 max-w-sm mb-6">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className={btnClass}>{actionLabel}</Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button onClick={onAction} className={btnClass}>{actionLabel}</button>
      )}
    </div>
  )
}
