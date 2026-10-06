import Category from '../models/Category.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 })
  return successResponse(res, { categories }, 'Categories fetched')
}

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
export const createCategory = async (req, res) => {
  const { name, description } = req.body
  if (!name || !String(name).trim()) {
    return errorResponse(res, 'Category name is required.', 400)
  }

  const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image || '')

  // Escape regex special characters to prevent injection
  const escapedName = String(name).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const existing = await Category.findOne({ name: { $regex: `^${escapedName}$`, $options: 'i' } })
  if (existing) return errorResponse(res, 'Category already exists.', 400)

  const category = await Category.create({ name: String(name).trim(), description, image })
  return successResponse(res, { category }, 'Category created', 201)
}

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
export const updateCategory = async (req, res) => {
  const updates = { ...req.body }
  if (req.file) updates.image = `/uploads/${req.file.filename}`

  const category = await Category.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })

  if (!category) return errorResponse(res, 'Category not found.', 404)
  return successResponse(res, { category }, 'Category updated')
}

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) return errorResponse(res, 'Category not found.', 404)
  await category.deleteOne()
  return successResponse(res, {}, 'Category deleted')
}
