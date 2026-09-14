import express from 'express'
import { protect } from '../middleware/auth.js'
import {
  placeOrder,
  getMyOrders,
  getOrderById,
} from '../controllers/orderController.js'

const router = express.Router()

router.use(protect)

router.post('/', placeOrder)
router.get('/my-orders', getMyOrders)
router.get('/:id', getOrderById)

export default router
