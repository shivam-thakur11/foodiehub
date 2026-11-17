/**
 * FoodieHub PRODUCTION Seed Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Safe to run against a live production database.
 *
 * What this script does:
 *   - Drops ONLY Food and Category collections
 *   - Re-inserts all categories and food items
 *   - Does NOT touch Users, Orders, Carts, or any other collections
 *
 * What this script does NOT do:
 *   - Does NOT delete existing user accounts
 *   - Does NOT delete existing orders
 *   - Does NOT create or overwrite admin/demo accounts
 *
 * Usage:
 *   node seed-prod.js
 *
 * Make sure MONGO_URI in .env points to the correct Atlas cluster before running.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true })

import mongoose from 'mongoose'
import Category from './models/Category.js'
import Food from './models/Food.js'
import { CATEGORIES, FOODS } from './seed.js'

async function seedProduction() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('ERROR: MONGO_URI is not defined in .env')
    process.exit(1)
  }

  console.log('Connecting to MongoDB Atlas…')
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 })
  console.log('Connected:', mongoose.connection.host)

  // Safety confirmation
  console.log('\nThis will REPLACE all Food and Category records.')
  console.log('Users, Orders, and Carts are NOT affected.\n')

  // Clear only foods and categories
  const [delCats, delFoods] = await Promise.all([
    Category.deleteMany({}),
    Food.deleteMany({}),
  ])
  console.log(`Cleared ${delCats.deletedCount} categories, ${delFoods.deletedCount} foods`)

  // Insert categories
  const insertedCats = await Category.insertMany(CATEGORIES)
  const catMap = {}
  insertedCats.forEach(cat => { catMap[cat.name] = cat._id })
  console.log(`Inserted ${insertedCats.length} categories`)

  // Insert foods
  const foodDocs = FOODS(catMap)
  const insertedFoods = await Food.insertMany(foodDocs)
  console.log(`Inserted ${insertedFoods.length} food items`)

  // Print summary per category
  const summary = {}
  foodDocs.forEach(f => {
    const catName = Object.keys(catMap).find(k => String(catMap[k]) === String(f.category))
    summary[catName] = (summary[catName] || 0) + 1
  })
  console.log('\nFoods per category:')
  Object.entries(summary).forEach(([name, count]) => console.log(`  ${name}: ${count}`))

  console.log('\nProduction seed complete.')
  console.log(`  Categories : ${insertedCats.length}`)
  console.log(`  Foods      : ${insertedFoods.length}`)

  await mongoose.disconnect()
  process.exit(0)
}

seedProduction().catch(err => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
