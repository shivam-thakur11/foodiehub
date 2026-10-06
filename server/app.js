import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import 'express-async-errors'

import authRoutes from './routes/authRoutes.js'
import foodRoutes from './routes/foodRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import errorHandler from './middleware/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Normalize client URLs (supports comma-separated list, strips trailing slashes)
const envOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean)

const allowedOrigins = new Set([
  ...envOrigins,
  'https://foodiehub-shivam-singh.netlify.app',
  'https://foodiehub-shivam-shivam.netlify.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
])

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (Postman, curl, server-to-server, mobile apps)
      if (!origin) return cb(null, true)

      const normalizedOrigin = origin.replace(/\/$/, '')
      if (
        allowedOrigins.has(normalizedOrigin) ||
        /^https:\/\/[a-zA-Z0-9-]+\.netlify\.app$/.test(normalizedOrigin) ||
        /^http:\/\/localhost:\d+$/.test(normalizedOrigin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(normalizedOrigin)
      ) {
        return cb(null, true)
      }

      // In production, reject disallowed origins gracefully without throwing an uncaught Error
      return cb(null, false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
)

// ─── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── HTTP request logger ──────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(morgan(':method :url :status :response-time ms - :res[content-length]'))
} else {
  app.use(morgan(':method :url :status :response-time ms'))
}

// ─── Static file serving for uploads ──────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  const isHealthy = dbStatus === 'connected'

  return res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'FoodieHub API is running 🍔' : 'Database disconnected',
    database: dbStatus,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/foods', foodRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/users', userRoutes)

// ─── 404 handler for unknown API routes ───────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' })
})

// ─── Centralised error handler (must be last) ─────────────────────────────────
app.use(errorHandler)

export default app
