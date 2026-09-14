import express from 'express'
import { body } from 'express-validator'
import validate from '../middleware/validate.js'
import { protect } from '../middleware/auth.js'
import {
  register,
  login,
  getMe,
  updateProfile,
} from '../controllers/authController.js'

const router = express.Router()

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
)

router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)

export default router
