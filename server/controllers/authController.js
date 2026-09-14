import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password, phone } = req.body

  const existing = await User.findOne({ email })
  if (existing) {
    return errorResponse(res, 'Email already registered.', 400)
  }

  const user = await User.create({ name, email, password, phone })
  const token = generateToken(user._id)

  return successResponse(res, { user, token }, 'Registration successful', 201)
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    return errorResponse(res, 'Invalid email or password.', 401)
  }

  if (!user.isActive) {
    return errorResponse(res, 'Your account has been deactivated.', 403)
  }

  const token = generateToken(user._id)
  // Strip password from response
  user.password = undefined

  return successResponse(res, { user, token }, 'Login successful')
}

// @desc    Get logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  return successResponse(res, { user: req.user }, 'User fetched')
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const { name, phone, addresses } = req.body

  // Only include fields that were actually sent — prevents null-overwriting
  // e.g. sending { addresses: [...] } should NOT wipe name/phone
  const updates = {}
  if (name !== undefined) updates.name = name
  if (phone !== undefined) updates.phone = phone
  if (addresses !== undefined) updates.addresses = addresses

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  )

  return successResponse(res, { user }, 'Profile updated')
}
