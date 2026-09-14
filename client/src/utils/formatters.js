/**
 * Format a number as Indian Rupee currency
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a date string to readable format
 */
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a date to relative time (e.g. "2 hours ago")
 */
export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

/**
 * Truncate text to a given max length
 */
export const truncate = (text, max = 80) => {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '…' : text
}

/**
 * Generate star rating display (returns number 0-5)
 */
export const getRatingLabel = (rating) => {
  if (rating >= 4.5) return 'Excellent'
  if (rating >= 4) return 'Very Good'
  if (rating >= 3) return 'Good'
  if (rating >= 2) return 'Fair'
  return 'Poor'
}
