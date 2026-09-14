import express from 'express'
import { body } from 'express-validator'
import validate from '../middleware/validate.js'
import { protect, adminOnly } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js'

const router = express.Router()

router.get('/', getCategories)

router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  validate,
  createCategory
)

router.put('/:id', protect, adminOnly, upload.single('image'), updateCategory)
router.delete('/:id', protect, adminOnly, deleteCategory)

export default router
