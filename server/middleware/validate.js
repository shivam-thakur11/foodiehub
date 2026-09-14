import { validationResult } from 'express-validator'

/**
 * Run after express-validator chains.
 * Returns 400 with the first validation error if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    })
  }
  next()
}

export default validate
