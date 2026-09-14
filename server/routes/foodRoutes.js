import express from 'express'
import { body } from 'express-validator'
import validate from '../middleware/validate.js'
import { protect, adminOnly } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  submitReview,
} from '../controllers/foodController.js'

const router = express.Router()

router.get('/', getFoods)
router.get('/:id', getFoodById)

// Review submission — logged-in users only
router.post(
  '/:id/reviews',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  validate,
  submitReview
)

router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Food name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  validate,
  createFood
)

router.put('/:id', protect, adminOnly, upload.single('image'), updateFood)
router.delete('/:id', protect, adminOnly, deleteFood)

export default router
