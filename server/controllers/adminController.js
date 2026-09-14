import Order from '../models/Order.js'
import User from '../models/User.js'
import Food from '../models/Food.js'
import Category from '../models/Category.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
export const getDashboard = async (req, res) => {
  const [totalUsers, totalOrders, totalFoods, totalCategories, recentOrders, revenueData] =
    await Promise.all([
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      Food.countDocuments(),
      Category.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
      Order.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ])

  const totalRevenue = revenueData[0]?.total || 0

  // Order status breakdown
  const statusBreakdown = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ])

  return successResponse(
    res,
    { stats: { totalUsers, totalOrders, totalFoods, totalCategories, totalRevenue }, recentOrders, statusBreakdown },
    'Dashboard data fetched'
  )
}

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Admin
export const getAllOrders = async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query

  const query = {}
  if (status) query.orderStatus = status

  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(100, parseInt(limit))
  const skip = (pageNum - 1) * limitNum

  let orders
  let total

  if (search) {
    // Text search on order ID suffix or populated user fields requires aggregation
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const allOrders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')

    const filtered = allOrders.filter(o =>
      o._id.toString().toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(escaped.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(escaped.toLowerCase())
    )
    total = filtered.length
    orders = filtered.slice(skip, skip + limitNum)
  } else {
    ;[orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'name email phone'),
      Order.countDocuments(query),
    ])
  }

  return successResponse(
    res,
    {
      orders,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
    },
    'Orders fetched'
  )
}

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body
  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']

  if (!validStatuses.includes(status)) {
    return errorResponse(res, 'Invalid order status.', 400)
  }

  const order = await Order.findById(req.params.id)
  if (!order) return errorResponse(res, 'Order not found.', 404)

  order.orderStatus = status
  // Auto-mark payment as paid when delivered (COD)
  if (status === 'Delivered' && order.paymentMethod === 'COD') {
    order.paymentStatus = 'Paid'
  }
  if (status === 'Cancelled') {
    order.paymentStatus = order.paymentMethod === 'COD' ? 'Pending' : 'Refunded'
  }

  await order.save()
  return successResponse(res, { order }, 'Order status updated')
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query
  const query = {}
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }

  const pageNum = Math.max(1, parseInt(page))
  const limitNum = Math.min(100, parseInt(limit))
  const skip = (pageNum - 1) * limitNum

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    User.countDocuments(query),
  ])

  return successResponse(
    res,
    {
      users,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
    },
    'Users fetched'
  )
}

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
export const updateUserRole = async (req, res) => {
  const { role } = req.body
  if (!['user', 'admin'].includes(role)) {
    return errorResponse(res, 'Invalid role.', 400)
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
  if (!user) return errorResponse(res, 'User not found.', 404)

  return successResponse(res, { user }, 'User role updated')
}

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Admin
export const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return errorResponse(res, 'User not found.', 404)

  // Prevent deactivating self
  if (user._id.toString() === req.user._id.toString()) {
    return errorResponse(res, 'You cannot deactivate your own account.', 400)
  }

  user.isActive = !user.isActive
  await user.save()

  return successResponse(
    res,
    { user },
    `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
  )
}
