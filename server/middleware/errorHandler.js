/**
 * Centralised error handling middleware.
 * Must be registered AFTER all routes with app.use(errorHandler).
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err.message)

  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400
    const messages = Object.values(err.errors).map((e) => e.message)
    message = messages.join(', ')
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400
    const keys = err.keyValue ? Object.keys(err.keyValue) : (err.keyPattern ? Object.keys(err.keyPattern) : [])
    const field = keys[0] || 'Field'
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404
    message = 'Resource not found.'
  }

  // Multer upload errors
  if (err.name === 'MulterError') {
    statusCode = 400
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds limit of 5MB.'
    } else {
      message = `Upload error: ${err.message}`
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token.'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired. Please log in again.'
  }

  // In production, mask internal 500 errors to prevent leaking database URLs or system paths
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error. Please try again later.'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export default errorHandler
