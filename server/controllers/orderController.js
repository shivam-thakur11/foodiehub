import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Food from '../models/Food.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

const DELIVERY_FEE = 40
const TAX_RATE = 0.05

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
export const placeOrder = async (req, res) => {
  const { deliveryAddress, paymentMethod = 'COD', notes, items: clientItems, couponCode } = req.body

  if (!deliveryAddress) {
    return errorResponse(res, 'Delivery address is required.', 400)
  }

  // Use provided items OR pull from cart
  let orderItems = []

  if (clientItems && clientItems.length > 0) {
    // Validate each item against DB to prevent price tampering
    for (const ci of clientItems) {
      // Validate quantity
      if (!ci.quantity || ci.quantity < 1 || ci.quantity > 50) {
        return errorResponse(res, `Invalid quantity for item: ${ci.foodId}. Must be between 1 and 50.`, 400)
      }
      const food = await Food.findById(ci.foodId)
      if (!food) return errorResponse(res, `Food item not found: ${ci.foodId}`, 404)
      if (!food.isAvailable) return errorResponse(res, `${food.name} is unavailable.`, 400)
      orderItems.push({
        food: food._id,
        name: food.name,
        image: food.image,
        price: food.price, // always use server price
        quantity: ci.quantity,
      })
    }
  } else {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.food')
    if (!cart || cart.items.length === 0) {
      return errorResponse(res, 'Cart is empty.', 400)
    }
    orderItems = cart.items.map((item) => ({
      food: item.food._id,
      name: item.food.name,
      image: item.food.image,
      price: item.food.price,
      quantity: item.quantity,
    }))
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2))

  // Validate and apply coupon
  let discount = 0
  let appliedCoupon = null
  if (couponCode) {
    const code = couponCode.trim().toUpperCase()
    const validCoupons = {
      'WELCOME20': { type: 'percentage', value: 20, minOrder: 0 },
      'SAVE50': { type: 'fixed', value: 50, minOrder: 200 },
      'FLAT100': { type: 'fixed', value: 100, minOrder: 500 },
    }

    const coupon = validCoupons[code]
    if (!coupon) {
      return errorResponse(res, 'Invalid coupon code.', 400)
    }

    if (subtotal < coupon.minOrder) {
      return errorResponse(res, `Minimum order of ₹${coupon.minOrder} required for this coupon.`, 400)
    }

    if (coupon.type === 'percentage') {
      discount = parseFloat(((subtotal * coupon.value) / 100).toFixed(2))
    } else if (coupon.type === 'fixed') {
      discount = coupon.value
    }

    appliedCoupon = code
  }

  const totalAmount = subtotal + DELIVERY_FEE + tax - discount

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    deliveryAddress,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    tax,
    discount,
    couponCode: appliedCoupon,
    totalAmount,
    paymentMethod,
    notes,
  })

  // Clear the cart after placing order
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] })

  return successResponse(res, { order }, 'Order placed successfully', 201)
}

// @desc    Get current user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.food', 'name image')
  return successResponse(res, { orders }, 'Orders fetched')
}

// @desc    Get order by ID (owner or admin)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.food', 'name image')
  if (!order) return errorResponse(res, 'Order not found.', 404)

  // Only owner or admin can view
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorised to view this order.', 403)
  }

  return successResponse(res, { order }, 'Order fetched')
}
