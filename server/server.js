import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'
import net from 'net'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import app from './app.js'
import connectDB from './config/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ── Check if a port is already in use (dev convenience only) ──────────────────
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once('error', () => resolve(true))
    server.once('listening', () => { server.close(); resolve(false) })
    server.listen(port, '0.0.0.0')
  })
}

// ── Find the first free port starting from `start` ───────────────────────────
async function findFreePort(start) {
  let port = start
  while (await isPortInUse(port)) {
    console.log(`  Port ${port} is busy — trying ${port + 1}…`)
    port++
  }
  return port
}

const PREFERRED = parseInt(process.env.PORT || '5003', 10)
const isProduction = process.env.NODE_ENV === 'production'

let server

const start = async () => {
  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, 'uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
    console.log('  uploads/ directory created')
  }

  await connectDB()

  // In production, bind strictly to the assigned PORT (e.g. Docker, Heroku, Render, AWS)
  const PORT = isProduction ? PREFERRED : await findFreePort(PREFERRED)
  if (!isProduction && PORT !== PREFERRED) {
    console.log(`  NOTE: Port ${PREFERRED} was busy. Using port ${PORT} instead.`)
    console.log(`  Update server/.env PORT=${PORT} to make this permanent.\n`)
  }

  const BASE = `http://localhost:${PORT}`
  const API = `${BASE}/api`

  server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n================================================')
    console.log(`  FoodieHub API  —  \x1b[32m● ACTIVE\x1b[0m`)
    console.log(`  Local  : ${BASE}`)
    console.log(`  Port   : ${PORT}`)
    console.log(`  DB     : \x1b[32m● MongoDB Connected\x1b[0m`)
    console.log(`  Env    : ${process.env.NODE_ENV || 'development'}`)
    console.log('================================================')
    if (!isProduction) {
      console.log('\n  Available routes')
      console.log('  ─────────────────────────────────────────────')
      console.log(`  GET  ${API}/health`)
      console.log(`  POST ${API}/auth/register`)
      console.log(`  POST ${API}/auth/login`)
      console.log(`  GET  ${API}/auth/me              [protected]`)
      console.log(`  PUT  ${API}/auth/profile         [protected]`)
      console.log(`  GET  ${API}/foods`)
      console.log(`  GET  ${API}/foods/:id`)
      console.log(`  POST ${API}/foods/:id/reviews    [protected]`)
      console.log(`  POST ${API}/foods                [admin]`)
      console.log(`  PUT  ${API}/foods/:id            [admin]`)
      console.log(`  DEL  ${API}/foods/:id            [admin]`)
      console.log(`  GET  ${API}/categories`)
      console.log(`  POST ${API}/categories           [admin]`)
      console.log(`  PUT  ${API}/categories/:id       [admin]`)
      console.log(`  DEL  ${API}/categories/:id       [admin]`)
      console.log(`  GET  ${API}/cart                 [protected]`)
      console.log(`  POST ${API}/cart                 [protected]`)
      console.log(`  PUT  ${API}/cart/:itemId         [protected]`)
      console.log(`  DEL  ${API}/cart/:itemId         [protected]`)
      console.log(`  DEL  ${API}/cart                 [protected]`)
      console.log(`  POST ${API}/orders               [protected]`)
      console.log(`  GET  ${API}/orders/my-orders     [protected]`)
      console.log(`  GET  ${API}/orders/:id           [protected]`)
      console.log(`  GET  ${API}/users/profile        [protected]`)
      console.log(`  PUT  ${API}/users/profile        [protected]`)
      console.log(`  GET  ${API}/users/addresses      [protected]`)
      console.log(`  POST ${API}/users/addresses      [protected]`)
      console.log(`  PUT  ${API}/users/addresses/:idx [protected]`)
      console.log(`  DEL  ${API}/users/addresses/:idx [protected]`)
      console.log(`  GET  ${API}/admin/dashboard      [admin]`)
      console.log(`  GET  ${API}/admin/orders         [admin]`)
      console.log(`  PUT  ${API}/admin/orders/:id/status [admin]`)
      console.log(`  GET  ${API}/admin/users          [admin]`)
      console.log(`  PUT  ${API}/admin/users/:id/role [admin]`)
      console.log(`  PUT  ${API}/admin/users/:id/toggle-status [admin]`)
      console.log('  ─────────────────────────────────────────────')
      console.log('\n  Requests:\n')
    }
  })
}

// ── Graceful shutdown & Process error handlers ────────────────────────────────
const handleShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`)
  if (server) {
    server.close(async () => {
      console.log('  HTTP server closed.')
      try {
        await mongoose.connection.close(false)
        console.log('  MongoDB connection closed.')
      } catch (err) {
        console.error('  Error closing MongoDB connection:', err.message)
      }
      process.exit(0)
    })
  } else {
    process.exit(0)
  }
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'))
process.on('SIGINT', () => handleShutdown('SIGINT'))

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err)
  process.exit(1)
})

start()
