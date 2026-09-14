import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { errorResponse } from '../utils/apiResponse.js'

/**
 * Protect routes — verify JWT and attach user to req
 */
export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return errorResponse(res, 'Not authorised. Please log in.', 401)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return errorResponse(res, 'User no longer exists.', 401)
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been deactivated.', 403)
    }

    req.user = user
    next()
  } catch (err) {
    return errorResponse(res, 'Invalid or expired token.', 401)
  }
}

/**
 * Restrict access to admin role only
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return errorResponse(res, 'Access denied. Admins only.', 403)
  }
  next()
}
