import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Star, Clock, Truck, ShieldCheck, Smartphone, ChevronRight, Quote, AlertCircle } from 'lucide-react'
import api from '../services/api'
import FoodCard from '../components/food/FoodCard'
import { FoodCardSkeleton } from '../components/common/Skeleton'

/* ─── STATIC DATA ───────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: 'Pizza', emoji: '🍕', slug: 'Pizza' },
  { name: 'Burgers', emoji: '🍔', slug: 'Burgers' },
  { name: 'Indian', emoji: '🍛', slug: 'Indian' },
  { name: 'Chinese', emoji: '🥡', slug: 'Chinese' },
  { name: 'Desserts', emoji: '🍰', slug: 'Desserts' },
  { name: 'Biryani', emoji: '🍚', slug: 'Biryani' },
  { name: 'Beverages', emoji: '🥤', slug: 'Beverages' },
  { name: 'Healthy', emoji: '🥗', slug: 'Healthy' },
]

const RESTAURANTS = [
  { name: 'Spice Garden', cuisine: 'Indian, Mughlai', rating: 4.7, time: '25–35', fee: 'Free', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop' },
  { name: 'Urban Bites', cuisine: 'Continental, Cafe', rating: 4.5, time: '20–30', fee: '₹20', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop' },
  { name: 'The Burger House', cuisine: 'Burgers, Fast Food', rating: 4.6, time: '15–25', fee: 'Free', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=250&fit=crop' },
  { name: 'Royal Biryani', cuisine: 'Biryani, Hyderabadi', rating: 4.8, time: '30–40', fee: '₹30', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=250&fit=crop' },
  { name: 'Pizza Point', cuisine: 'Pizza, Italian', rating: 4.4, time: '20–35', fee: 'Free', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=250&fit=crop' },
]

const BENEFITS = [
  { icon: Truck, title: 'Fast Delivery', desc: 'Hot meals delivered to your door in 30 minutes or less.' },
  { icon: ShieldCheck, title: 'Fresh Food', desc: 'Only quality ingredients from trusted restaurant partners.' },
  { icon: Smartphone, title: 'Easy Ordering', desc: 'Simple, intuitive experience from browse to checkout.' },
  { icon: Star, title: 'Top Quality', desc: 'Rated 4.8/5 by thousands of satisfied customers.' },
]

const REVIEWS = [
  { name: 'Priya Sharma', avatar: 'P', rating: 5, text: 'Absolutely love FoodieHub! The delivery is always on time and the food is piping hot. My go-to app for ordering dinner.' },
  { name: 'Rahul Mehta', avatar: 'R', rating: 5, text: 'Great variety of restaurants and cuisines. The UI is clean and ordering is super easy. Highly recommended!' },
  { name: 'Anita Desai', avatar: 'A', rating: 4, text: 'Really impressed with the service. The order tracking feature is a nice touch. Will definitely order again.' },
]

/* ─── COMPONENT ─────────────────────────────────────────────────────── */
export default function Home() {
  const [search, setSearch] = useState('')
  const [foods, setFoods] = useState([])
  const [loadingFoods, setLoadingFoods] = useState(true)
  // null = not yet known, true = server error, false = no error
  const [foodError, setFoodError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoadingFoods(true)
    setFoodError(null)
    api.get('/foods', { params: { limit: 8, sort: 'rating' } })
      .then(r => {
        setFoods(r.data.foods || [])
        setFoodError(false)
      })
      .catch(err => {
        // Distinguish "server is unreachable" from "truly 0 foods"
        const isNetworkErr = !err.response           // no response → server down / CORS / timeout
        const is5xx = err.response?.status >= 500
        setFoodError(isNetworkErr || is5xx ? 'server' : 'empty')
        setFoods([])
      })
      .finally(() => setLoadingFoods(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/menu?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-[#FFF7F2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                🚀 Delivering in 30 minutes
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
                Good food,<br />
                <span className="text-orange-500">good mood.</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl">
                Discover delicious meals from your favourite restaurants and get them delivered straight to your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/menu" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors text-base">
                  Order Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/menu" className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-orange-300 text-gray-700 hover:text-orange-500 font-semibold px-8 py-3.5 rounded-2xl transition-colors text-base">
                  Explore Menu
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-10">
                {[['500+', 'Restaurants'], ['50k+', 'Happy Customers'], ['4.8★', 'App Rating']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <p className="text-2xl font-bold text-gray-900">{val}</p>
                    <p className="text-xs text-gray-400">{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                <div className="absolute inset-0 bg-orange-200 rounded-full opacity-30 blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop"
                  alt="Delicious food"
                  className="relative w-full h-full object-cover rounded-full shadow-2xl border-8 border-white"
                />
                <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2.5 border border-gray-100">
                  <span className="text-2xl">🍔</span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Burger Combo</p>
                    <p className="text-xs text-orange-500 font-semibold">₹199</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2.5 border border-gray-100">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Top Rated</p>
                    <p className="text-xs text-gray-400">4.9 / 5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH ───────────────────────────────────────────────────── */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSearch} className="relative flex items-center shadow-lg rounded-2xl border border-gray-200 overflow-hidden bg-white">
            <Search className="absolute left-5 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for food, restaurants or cuisines…"
              className="w-full py-4 pl-14 pr-4 text-sm text-gray-700 bg-transparent focus:outline-none"
            />
            <button type="submit" className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-4 transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-orange-500 text-sm font-semibold mb-1">Browse by category</p>
              <h2 className="text-3xl font-bold text-gray-900">Food Categories</h2>
            </div>
            <Link to="/menu" className="hidden sm:flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/menu?category=${encodeURIComponent(cat.slug)}`}
                className="group flex flex-col items-center gap-2.5 bg-white rounded-2xl p-4 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-orange-50 group-hover:bg-orange-100 rounded-2xl flex items-center justify-center text-2xl transition-colors">
                  {cat.emoji}
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-500 transition-colors text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR DISHES ───────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-orange-500 text-sm font-semibold mb-1">Trending now</p>
              <h2 className="text-3xl font-bold text-gray-900">Popular Dishes</h2>
            </div>
            <Link to="/menu" className="hidden sm:flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Loading skeletons */}
          {loadingFoods && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <FoodCardSkeleton key={i} />)}
            </div>
          )}

          {/* Server / network error */}
          {!loadingFoods && foodError === 'server' && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="font-semibold text-red-700 mb-1">Cannot reach the server</p>
              <p className="text-sm text-red-500 mb-4">Make sure the backend is running on port 5000 and MongoDB is connected.</p>
              <Link to="/menu" className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
                Try Menu Page
              </Link>
            </div>
          )}

          {/* Truly empty database */}
          {!loadingFoods && foodError === 'empty' && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-sm font-medium text-gray-500 mb-1">No foods in the database yet.</p>
              <p className="text-xs text-gray-400">Run <code className="bg-gray-100 px-1.5 py-0.5 rounded">npm run seed</code> in the server directory.</p>
            </div>
          )}

          {/* Foods loaded */}
          {!loadingFoods && !foodError && foods.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {foods.map(food => <FoodCard key={food._id} food={food} />)}
              </div>
              <div className="text-center mt-8">
                <Link to="/menu" className="inline-flex items-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold px-8 py-3 rounded-2xl transition-colors">
                  View Full Menu <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── FEATURED RESTAURANTS ─────────────────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-orange-500 text-sm font-semibold mb-1">Our partners</p>
            <h2 className="text-3xl font-bold text-gray-900">Featured Restaurants</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {RESTAURANTS.map(r => (
              <Link to="/menu" key={r.name} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="h-36 overflow-hidden bg-gray-100">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop' }} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5 truncate">{r.name}</h3>
                  <p className="text-xs text-gray-400 truncate mb-2">{r.cuisine}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-gray-700">{r.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{r.time} min</span>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    {r.fee === 'Free' ? '🎉 Free delivery' : `Delivery ${r.fee}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold mb-1">Why us?</p>
            <h2 className="text-3xl font-bold text-gray-900">Why Choose FoodieHub?</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">We make food ordering simple, fast, and enjoyable — every single time.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center hover:border-orange-200 transition-colors">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFER ────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-500 rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-10 lg:p-16">
                <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  🎉 Limited time offer
                </span>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
                  Get 20% OFF<br />your first order!
                </h2>
                <p className="text-orange-100 mb-6 text-sm leading-relaxed">
                  New to FoodieHub? Use code <strong className="text-white">WELCOME20</strong> at checkout and enjoy 20% off your first delivery.
                </p>
                <Link to="/register" className="inline-flex items-center gap-2 bg-white text-orange-500 hover:bg-orange-50 font-semibold px-8 py-3.5 rounded-2xl transition-colors">
                  Order Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="hidden md:flex items-center justify-center p-10">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop"
                  alt="Food spread"
                  className="w-64 h-64 object-cover rounded-full shadow-2xl border-8 border-white/20"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOMER REVIEWS ─────────────────────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold mb-1">Customer love</p>
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map(r => (
              <div key={r.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                <Quote className="absolute top-5 right-5 w-6 h-6 text-orange-100" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">{r.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    <div className="flex">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
