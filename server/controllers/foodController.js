import Food from '../models/Food.js'
import Category from '../models/Category.js'
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js'

// @route   GET /api/foods
export const getFoods = async (req, res) => {
  const {
    search, category, categoryName, minPrice, maxPrice,
    rating, sort = 'createdAt', page = 1, limit = 12, isVegetarian,
  } = req.query

  const query = { isAvailable: true }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  }

  // Support both category ID and category name
  if (category) {
    query.category = category
  } else if (categoryName) {
    // Escape regex special characters to prevent injection
    const escapedName = categoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const cat = await Category.findOne({ name: { $regex: `^${escapedName}$`, $options: 'i' } })
    if (cat) query.category = cat._id
  }

  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice)
    if (maxPrice) query.price.$lte = Number(maxPrice)
  }

  if (rating) query.rating = { $gte: Number(rating) }
  if (isVegetarian === 'true') query.isVegetarian = true

  const sortMap = {
    createdAt: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
  }
  const sortOption = sortMap[sort] || { createdAt: -1 }

  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(50, parseInt(limit))
  const skip = (pageNum - 1) * limitNum

  const [foods, total] = await Promise.all([
    Food.find(query)
      .populate('category', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Food.countDocuments(query),
  ])

  return paginatedResponse(res, { foods }, {
    total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum,
  })
}

// @route   GET /api/foods/:id
export const getFoodById = async (req, res) => {
  const food = await Food.findById(req.params.id).populate('category', 'name')
  if (!food) return errorResponse(res, 'Food not found.', 404)
  return successResponse(res, { food }, 'Food fetched')
}

// @route   POST /api/foods  (admin)
export const createFood = async (req, res) => {
  const {
    name, description, price, category,
    isAvailable, isVegetarian, isFeatured, preparationTime,
  } = req.body

  // Support URL-based image or uploaded file
  const image = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.image || ''

  const food = await Food.create({
    name, description, price: Number(price), category, image,
    isAvailable: isAvailable !== undefined ? isAvailable === 'true' || isAvailable === true : true,
    isVegetarian: isVegetarian === 'true' || isVegetarian === true || false,
    isFeatured: isFeatured === 'true' || isFeatured === true || false,
    preparationTime: preparationTime || 30,
  })

  const populated = await food.populate('category', 'name')
  return successResponse(res, { food: populated }, 'Food created', 201)
}

// @route   PUT /api/foods/:id  (admin)
export const updateFood = async (req, res) => {
  const food = await Food.findById(req.params.id)
  if (!food) return errorResponse(res, 'Food not found.', 404)

  const updates = { ...req.body }
  if (req.file) updates.image = `/uploads/${req.file.filename}`
  if (updates.price) updates.price = Number(updates.price)
  // Coerce booleans sent as strings
  if (updates.isAvailable !== undefined) updates.isAvailable = updates.isAvailable === 'true' || updates.isAvailable === true
  if (updates.isVegetarian !== undefined) updates.isVegetarian = updates.isVegetarian === 'true' || updates.isVegetarian === true
  if (updates.isFeatured !== undefined) updates.isFeatured = updates.isFeatured === 'true' || updates.isFeatured === true

  const updated = await Food.findByIdAndUpdate(req.params.id, updates, {
    new: true, runValidators: true,
  }).populate('category', 'name')

  return successResponse(res, { food: updated }, 'Food updated')
}

// @route   DELETE /api/foods/:id  (admin)
export const deleteFood = async (req, res) => {
  const food = await Food.findById(req.params.id)
  if (!food) return errorResponse(res, 'Food not found.', 404)
  await food.deleteOne()
  return successResponse(res, {}, 'Food deleted')
}

// @route   POST /api/foods/:id/reviews  (authenticated user)
export const submitReview = async (req, res) => {
  const { rating, comment } = req.body

  const food = await Food.findById(req.params.id)
  if (!food) return errorResponse(res, 'Food not found.', 404)

  // One review per user
  const alreadyReviewed = food.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  )
  if (alreadyReviewed) {
    return errorResponse(res, 'You have already reviewed this item.', 400)
  }

  food.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  })

  // Recalculate aggregate rating
  food.numReviews = food.reviews.length
  food.rating =
    food.reviews.reduce((sum, r) => sum + r.rating, 0) / food.reviews.length

  await food.save()
  const populated = await food.populate('category', 'name')
  return successResponse(res, { food: populated }, 'Review submitted', 201)
}
