import express from 'express'
import { protect, adminOnly } from '../middleware/auth.js'
import {
  getDashboard,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
} from '../controllers/adminController.js'

const router = express.Router()

router.use(protect, adminOnly) // All admin routes are protected + admin-only

router.get('/dashboard', getDashboard)
router.get('/orders', getAllOrders)
router.put('/orders/:id/status', updateOrderStatus)
router.get('/users', getAllUsers)
router.put('/users/:id/role', updateUserRole)
router.put('/users/:id/toggle-status', toggleUserStatus)

export default router
