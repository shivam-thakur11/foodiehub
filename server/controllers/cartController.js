import Cart from '../models/Cart.js'
import Food from '../models/Food.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.food')
  if (!cart) return successResponse(res, { cart: { items: [] } }, 'Cart fetched')
  return successResponse(res, { cart }, 'Cart fetched')
}

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  const { foodId, quantity = 1 } = req.body

  const food = await Food.findById(foodId)
  if (!food) return errorResponse(res, 'Food not found.', 404)
  if (!food.isAvailable) return errorResponse(res, 'This item is currently unavailable.', 400)

  let cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ food: foodId, quantity, price: food.price }],
    })
  } else {
    const existingItem = cart.items.find((item) => item.food.toString() === foodId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ food: foodId, quantity, price: food.price })
    }
    await cart.save()
  }

  await cart.populate('items.food')
  return successResponse(res, { cart }, 'Item added to cart', 201)
}

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return errorResponse(res, 'Cart not found.', 404)

  const item = cart.items.id(req.params.itemId)
  if (!item) return errorResponse(res, 'Item not found in cart.', 404)

  if (quantity <= 0) {
    item.deleteOne()
  } else {
    item.quantity = quantity
  }

  await cart.save()
  await cart.populate('items.food')
  return successResponse(res, { cart }, 'Cart updated')
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return errorResponse(res, 'Cart not found.', 404)

  const item = cart.items.id(req.params.itemId)
  if (!item) return errorResponse(res, 'Item not found in cart.', 404)

  item.deleteOne()
  await cart.save()
  await cart.populate('items.food')
  return successResponse(res, { cart }, 'Item removed')
}

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] })
  return successResponse(res, {}, 'Cart cleared')
}
