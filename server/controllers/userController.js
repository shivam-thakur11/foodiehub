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
  if (!user.addresses[idx]) return errorResponse(res, 'Address not found', 404)
  user.addresses[idx] = { ...user.addresses[idx].toObject(), ...req.body }
  await user.save()
  return successResponse(res, { addresses: user.addresses }, 'Address updated')
}

export const deleteAddress = async (req, res) => {
  const { idx } = req.params
  const user = await User.findById(req.user._id)
  if (!user.addresses[idx]) return errorResponse(res, 'Address not found', 404)
  user.addresses.splice(idx, 1)
  await user.save()
  return successResponse(res, { addresses: user.addresses }, 'Address removed')
}
