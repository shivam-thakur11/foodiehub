import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js'
import connectDB from './config/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000

const start = async () => {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, 'uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
    console.log('✓ Created uploads directory')
  }

  await connectDB()

  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║   FoodieHub Server running on ${PORT}   ║
║   Environment: ${process.env.NODE_ENV || 'development'}          ║
╚══════════════════════════════════════╝
    `)
  })
}

start()
