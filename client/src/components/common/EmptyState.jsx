import React from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

/**
 * EmptyState — shown when an API returns no results (not an error).
 * Does NOT show developer commands or internal error details.
 */
export default function EmptyState({
  title = 'No results found',
  description = '',
  actionLabel,
  actionTo,
  onAction,
  icon: Icon = Search,
}) {
  const btnClass =
    'inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm'

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className={btnClass}>{actionLabel}</Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button onClick={onAction} className={btnClass}>{actionLabel}</button>
      )}
    </div>
  )
}
