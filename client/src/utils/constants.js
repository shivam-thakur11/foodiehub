export const DELIVERY_FEE = 40
export const TAX_RATE = 0.05 // 5%

export const ORDER_STATUSES = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export const ORDER_STATUS_COLORS = {
  Pending: 'badge-yellow',
  Confirmed: 'badge-blue',
  Preparing: 'badge-orange',
  'Out for Delivery': 'badge-blue',
  Delivered: 'badge-green',
  Cancelled: 'badge-red',
}

export const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'CARD', label: 'Credit / Debit Card (Test)' },
  { value: 'UPI', label: 'UPI (Test)' },
]

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]
