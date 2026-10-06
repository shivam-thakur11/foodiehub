import Cart from '../models/Cart.js'
import Food from '../models/Food.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.food')
  if (!cart) return successResponse(res, { cart: { items: [], total: 0 } }, 'Cart fetched')

  // Clean up any orphaned items where the food was deleted from the database
  const validItems = cart.items.filter((item) => item.food != null)
  if (validItems.length !== cart.items.length) {
    cart.items = validItems
    await cart.save()
  }

  return successResponse(res, { cart }, 'Cart fetched')
}

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  const { foodId, quantity = 1 } = req.body

  if (!foodId) {
    return errorResponse(res, 'Food ID is required.', 400)
  }

  const parsedQty = Math.max(1, Math.min(50, parseInt(quantity, 10) || 1))

  const food = await Food.findById(foodId)
  if (!food) return errorResponse(res, 'Food not found.', 404)
  if (!food.isAvailable) return errorResponse(res, 'This item is currently unavailable.', 400)

  let cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    try {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ food: foodId, quantity: parsedQty, price: food.price }],
      })
    } catch (err) {
      if (err.code === 11000) {
        cart = await Cart.findOne({ user: req.user._id })
      } else {
        throw err
      }
    }
  }

  if (cart) {
    const existingItem = cart.items.find((item) => item.food?.toString() === foodId)
    if (existingItem) {
      existingItem.quantity = Math.min(50, existingItem.quantity + parsedQty)
    } else {
      cart.items.push({ food: foodId, quantity: parsedQty, price: food.price })
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

  const parsedQty = parseInt(quantity, 10)
  if (isNaN(parsedQty) || parsedQty <= 0) {
    cart.items.pull(req.params.itemId)
  } else {
    item.quantity = Math.min(50, parsedQty)
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

  cart.items.pull(req.params.itemId)
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
