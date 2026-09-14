import express from 'express'
import { protect } from '../middleware/auth.js'
import { getProfile, updateProfile, getAddresses, addAddress, updateAddress, deleteAddress } from '../controllers/userController.js'

const router = express.Router()
router.use(protect)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.get('/addresses', getAddresses)
router.post('/addresses', addAddress)
router.put('/addresses/:idx', updateAddress)
router.delete('/addresses/:idx', deleteAddress)

export default router
