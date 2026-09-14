/**
 * FoodieHub Seed Script
 * Run: npm run seed   (from the server/ directory)
 *
 * Passwords are plain text here — the User model's pre('save') hook
 * hashes them automatically. Do NOT pre-hash or logins will fail.
 */
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import User from './models/User.js'
import Category from './models/Category.js'
import Food from './models/Food.js'

const CATEGORIES = [
  {
    name: 'Pizza',
    description: 'Hand-tossed and stone-baked pizzas',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  },
  {
    name: 'Burgers',
    description: 'Juicy gourmet burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  },
  {
    name: 'Indian',
    description: 'Authentic Indian curries and breads',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
  },
  {
    name: 'Chinese',
    description: 'Wok-tossed noodles and fried rice',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
  },
  {
    name: 'Desserts',
    description: 'Sweet treats and indulgent desserts',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
  },
  {
    name: 'Biryani',
    description: 'Fragrant rice dishes cooked to perfection',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
  },
  {
    name: 'Beverages',
    description: 'Refreshing drinks and smoothies',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
  },
  {
    name: 'Healthy',
    description: 'Nutritious salads and clean-eating bowls',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  },
  {
    name: 'South Indian',
    description: 'Authentic South Indian breakfasts, tiffins, and rice dishes',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
  },
]

const FOODS = (c) => [
  // ── PIZZA (5 items) ──────────────────────────────────────────────────────────
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with San Marzano tomato sauce, fresh mozzarella, and fragrant basil on a hand-tossed crust.',
    price: 299, category: c['Pizza'], rating: 4.6, numReviews: 124,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: true, preparationTime: 20,
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Loaded with premium pepperoni slices, mozzarella, and zesty tomato sauce on a crispy thin crust.',
    price: 369, category: c['Pizza'], rating: 4.7, numReviews: 98,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: false, preparationTime: 25,
  },
  {
    name: 'Paneer Tikka Pizza',
    description: 'Fusion pizza topped with spiced paneer tikka, capsicum, onions, and tangy tikka sauce.',
    price: 349, category: c['Pizza'], rating: 4.5, numReviews: 76,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 25,
  },
  {
    name: 'BBQ Chicken Pizza',
    description: 'Smoky BBQ sauce base with grilled chicken strips, red onion, mozzarella, and fresh coriander.',
    price: 389, category: c['Pizza'], rating: 4.6, numReviews: 88,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: false, preparationTime: 28,
  },
  {
    name: 'Farmhouse Pizza',
    description: 'Garden-fresh capsicum, onion, tomato, and mushroom loaded on a thick cheesy crust with Italian herbs.',
    price: 319, category: c['Pizza'], rating: 4.4, numReviews: 65,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 22,
  },

  // ── BURGERS (4 items) ────────────────────────────────────────────────────────
  {
    name: 'Classic Chicken Burger',
    description: 'Crispy fried chicken patty, lettuce, tomato, pickles, and signature mayo in a toasted brioche bun.',
    price: 199, category: c['Burgers'], rating: 4.7, numReviews: 210,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: true, preparationTime: 15,
  },
  {
    name: 'Veggie Supreme Burger',
    description: 'Wholesome veggie patty made with chickpeas and oats, loaded with fresh veggies and chipotle sauce.',
    price: 179, category: c['Burgers'], rating: 4.3, numReviews: 88,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 15,
  },
  {
    name: 'Double Smash Burger',
    description: 'Two smashed beef patties with American cheese, caramelized onions, and secret house sauce.',
    price: 279, category: c['Burgers'], rating: 4.8, numReviews: 145,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: true, preparationTime: 18,
  },
  {
    name: 'Cheese Burger',
    description: 'Juicy beef patty topped with double cheddar cheese, crisp lettuce, tomato, and tangy mustard sauce.',
    price: 229, category: c['Burgers'], rating: 4.5, numReviews: 117,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: false, preparationTime: 16,
  },

  // ── INDIAN (5 items) ─────────────────────────────────────────────────────────
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich, velvety tomato-cream sauce flavoured with aromatic spices and kasuri methi.',
    price: 279, category: c['Indian'], rating: 4.8, numReviews: 312,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: true, preparationTime: 25,
  },
  {
    name: 'Paneer Tikka Masala',
    description: 'Grilled paneer cubes in a spiced onion-tomato-cashew gravy. Served with garlic naan.',
    price: 249, category: c['Indian'], rating: 4.6, numReviews: 189,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: true, preparationTime: 25,
  },
  {
    name: 'Masala Dosa',
    description: 'Crispy golden dosa stuffed with spiced potato masala, served with coconut chutney and sambar.',
    price: 149, category: c['Indian'], rating: 4.5, numReviews: 134,
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 20,
  },
  {
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in a buttery tomato gravy, finished with a swirl of cream. Classic comfort food.',
    price: 219, category: c['Indian'], rating: 4.5, numReviews: 102,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 30,
  },
  {
    name: 'Chole Bhature',
    description: 'Spicy chickpea curry paired with fluffy deep-fried bhature. A North Indian breakfast favourite.',
    price: 169, category: c['Indian'], rating: 4.4, numReviews: 97,
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 20,
  },

  // ── CHINESE (4 items) ────────────────────────────────────────────────────────
  {
    name: 'Hakka Noodles',
    description: 'Stir-fried noodles with crunchy vegetables and aromatic sauces tossed in a blazing wok.',
    price: 189, category: c['Chinese'], rating: 4.4, numReviews: 156,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 15,
  },
  {
    name: 'Chicken Manchurian',
    description: 'Crispy chicken balls tossed in a bold, spicy Manchurian sauce with spring onions and peppers.',
    price: 219, category: c['Chinese'], rating: 4.6, numReviews: 198,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: true, preparationTime: 20,
  },
  {
    name: 'Veg Fried Rice',
    description: 'Fluffy wok-tossed rice with seasonal vegetables, scrambled egg, and house soy sauce.',
    price: 169, category: c['Chinese'], rating: 4.3, numReviews: 112,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 15,
  },
  {
    name: 'Schezwan Chicken',
    description: 'Tender chicken wok-tossed with fiery Schezwan sauce, bell peppers, and spring onions.',
    price: 239, category: c['Chinese'], rating: 4.5, numReviews: 141,
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: false, preparationTime: 20,
  },

  // ── BIRYANI (4 items) ────────────────────────────────────────────────────────
  {
    name: 'Hyderabadi Chicken Biryani',
    description: 'Slow-cooked dum biryani with tender chicken, aged basmati, and whole spices. Served with raita.',
    price: 269, category: c['Biryani'], rating: 4.9, numReviews: 423,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: true, preparationTime: 40,
  },
  {
    name: 'Mutton Dum Biryani',
    description: 'Royal mutton biryani sealed and slow-cooked with caramelized onions and saffron-infused rice.',
    price: 329, category: c['Biryani'], rating: 4.8, numReviews: 267,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: false, preparationTime: 45,
  },
  {
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice cooked with seasonal vegetables, paneer, and whole spices in dum style.',
    price: 219, category: c['Biryani'], rating: 4.4, numReviews: 189,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 35,
  },
  {
    name: 'Egg Biryani',
    description: 'Fluffy basmati rice layered with spiced masala eggs, caramelized onions, and fresh mint.',
    price: 199, category: c['Biryani'], rating: 4.3, numReviews: 134,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: false, preparationTime: 35,
  },

  // ── DESSERTS (4 items) ───────────────────────────────────────────────────────
  {
    name: 'Chocolate Brownie',
    description: 'Warm fudgy chocolate brownie with a crisp top, served with a scoop of vanilla ice cream.',
    price: 149, category: c['Desserts'], rating: 4.7, numReviews: 201,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 10,
  },
  {
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in fragrant rose-cardamom sugar syrup. Served warm.',
    price: 99, category: c['Desserts'], rating: 4.6, numReviews: 178,
    image: 'https://images.unsplash.com/photo-1601303516534-bf4c55c78ab0?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 10,
  },
  {
    name: 'New York Cheesecake',
    description: 'Dense, creamy baked cheesecake on a graham cracker crust, topped with fresh berry compote.',
    price: 169, category: c['Desserts'], rating: 4.5, numReviews: 134,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 10,
  },
  {
    name: 'Idli',
    description: 'Soft and fluffy steamed Idli served with coconut chutney and sambar.',
    price: 99, category: c['South Indian'], rating: 4.7, numReviews: 156,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 10,
  },

  // ── BEVERAGES (4 items) ──────────────────────────────────────────────────────
  {
    name: 'Cold Coffee',
    description: 'Chilled, creamy blended coffee with a shot of espresso, milk, and a dash of vanilla. Pure bliss.',
    price: 129, category: c['Beverages'], rating: 4.5, numReviews: 167,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 5,
  },
  {
    name: 'Mango Lassi',
    description: 'Thick and frothy yoghurt drink blended with fresh Alphonso mango pulp and a pinch of cardamom.',
    price: 109, category: c['Beverages'], rating: 4.7, numReviews: 143,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 5,
  },
  {
    name: 'Fresh Lime Soda',
    description: 'Freshly squeezed lime juice topped with chilled soda — choose sweet, salty, or masala.',
    price: 79, category: c['Beverages'], rating: 4.4, numReviews: 112,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 3,
  },
  {
    name: 'Strawberry Milkshake',
    description: 'Thick, creamy milkshake blended with fresh strawberries and topped with whipped cream.',
    price: 139, category: c['Beverages'], rating: 4.6, numReviews: 98,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 5,
  },

  // ── HEALTHY (4 items) ────────────────────────────────────────────────────────
  {
    name: 'Grilled Chicken Salad',
    description: 'Fresh garden salad with grilled chicken strips, cherry tomatoes, avocado, and honey-lemon dressing.',
    price: 229, category: c['Healthy'], rating: 4.4, numReviews: 89,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=450&fit=crop',
    isVegetarian: false, isFeatured: false, preparationTime: 15,
  },
  {
    name: 'Quinoa Buddha Bowl',
    description: 'Nourishing bowl with quinoa, roasted chickpeas, sweet potato, spinach, and tahini drizzle.',
    price: 249, category: c['Healthy'], rating: 4.6, numReviews: 72,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 20,
  },
  {
    name: 'Acai Berry Smoothie Bowl',
    description: 'Blended acai with banana and almond milk, topped with granola, fresh berries, and honey.',
    price: 259, category: c['Healthy'], rating: 4.5, numReviews: 61,
    image: 'https://images.unsplash.com/photo-1490323914169-4b83adab8429?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 10,
  },
  {
    name: 'Veg Oats Upma',
    description: 'Light and nutritious roasted oats upma with seasonal vegetables, mustard seeds, and curry leaves.',
    price: 119, category: c['Healthy'], rating: 4.2, numReviews: 54,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=450&fit=crop',
    isVegetarian: true, isFeatured: false, preparationTime: 15,
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB:', process.env.MONGO_URI)

    // Clear only seed collections — preserves any manual entries made outside seed
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Food.deleteMany({}),
    ])
    console.log('🗑️  Cleared Users, Categories, Foods')

    // Insert categories
    const insertedCats = await Category.insertMany(CATEGORIES)
    const catMap = {}
    insertedCats.forEach(cat => { catMap[cat.name] = cat._id })
    console.log(`📂 Seeded ${insertedCats.length} categories`)

    // Insert foods (catMap is now populated)
    const foodDocs = FOODS(catMap)
    const insertedFoods = await Food.insertMany(foodDocs)
    console.log(`🍔 Seeded ${insertedFoods.length} food items`)

    // Admin user — plain text, pre('save') hook hashes it
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@foodiehub.com',
      password: 'admin123',
      phone: '9000000001',
      role: 'admin',
      isActive: true,
    })
    console.log(`🛡️  Admin:     ${admin.email}  /  admin123`)

    // Demo user with a saved address
    const demo = await User.create({
      name: 'Demo User',
      email: 'user@foodiehub.com',
      password: 'user123',
      phone: '9000000002',
      role: 'user',
      isActive: true,
      addresses: [
        {
          label: 'Home',
          street: '12, Rose Garden Apartments, MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '9000000002',
        },
      ],
    })
    console.log(`👤 Demo user: ${demo.email}  /  user123`)

    console.log('\n🎉 Seeding complete!')
    console.log('─────────────────────────────────────────')
    console.log(`   Categories : ${insertedCats.length}`)
    console.log(`   Foods      : ${insertedFoods.length}`)
    console.log('─────────────────────────────────────────')
    console.log('   Admin:  admin@foodiehub.com / admin123')
    console.log('   User:   user@foodiehub.com  / user123')
    console.log('─────────────────────────────────────────\n')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err.message)
    process.exit(1)
  }
}

seed()
