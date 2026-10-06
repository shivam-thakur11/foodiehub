import User from '../models/User.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

export const getProfile = async (req, res) => {
  return successResponse(res, { user: req.user }, 'Profile fetched')
}

export const updateProfile = async (req, res) => {
  const { name, phone, addresses } = req.body
  const updates = {}
  if (name !== undefined) updates.name = name
  if (phone !== undefined) updates.phone = phone
  if (addresses !== undefined) updates.addresses = addresses

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
  return successResponse(res, { user }, 'Profile updated')
}

export const getAddresses = async (req, res) => {
  return successResponse(res, { addresses: req.user.addresses || [] }, 'Addresses fetched')
}

export const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id)
  user.addresses.push(req.body)
  await user.save()
  return successResponse(res, { addresses: user.addresses }, 'Address added', 201)
}

export const updateAddress = async (req, res) => {
  const { idx } = req.params
  const user = await User.findById(req.user._id)
  if (!user) return errorResponse(res, 'User not found', 404)

  let address = user.addresses.id(idx)
  if (!address && /^\d+$/.test(idx)) {
    address = user.addresses[parseInt(idx, 10)]
  }

  if (!address) return errorResponse(res, 'Address not found', 404)

  Object.assign(address, req.body)
  await user.save()
  return successResponse(res, { addresses: user.addresses }, 'Address updated')
}

export const deleteAddress = async (req, res) => {
  const { idx } = req.params
  const user = await User.findById(req.user._id)
  if (!user) return errorResponse(res, 'User not found', 404)

  const address = user.addresses.id(idx)
  if (address) {
    user.addresses.pull(address._id)
  } else if (/^\d+$/.test(idx) && user.addresses[parseInt(idx, 10)]) {
    user.addresses.splice(parseInt(idx, 10), 1)
  } else {
    return errorResponse(res, 'Address not found', 404)
  }

  await user.save()
  return successResponse(res, { addresses: user.addresses }, 'Address removed')
}
