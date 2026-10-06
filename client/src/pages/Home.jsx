import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, Star, Clock, Truck,
  ShieldCheck, Smartphone, ChevronRight, Quote, AlertCircle,
} from 'lucide-react'
import api from '../services/api'
import FoodCard from '../components/food/FoodCard'
import { FoodCardSkeleton, CategoryCardSkeleton } from '../components/common/Skeleton'

const NEUTRAL_CATEGORY_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23fed7aa'%3E%3Crect width='100' height='100' rx='16' fill='%23fff7ed'/%3E%3Ccircle cx='50' cy='50' r='26' fill='%23ffedd5' stroke='%23fdba74' stroke-width='2'/%3E%3Ccircle cx='50' cy='50' r='14' fill='%23fb923c'/%3E%3C/svg%3E"

/* ─── STATIC DATA ───────────────────────────────────────────────────── */
const BENEFITS = [
  { icon: Truck,        title: 'Fast Delivery',   desc: 'Orders dispatched quickly so your meal arrives fresh and hot.' },
  { icon: ShieldCheck,  title: 'Quality Assured', desc: 'Every item prepared with fresh ingredients from trusted kitchens.' },
  { icon: Smartphone,   title: 'Easy Ordering',   desc: 'Browse, add to cart, and checkout in just a few taps.' },
  { icon: Star,         title: 'Rated Highly',    desc: 'Consistently rated by customers for quality and reliability.' },
]

/* ─── COMPONENT ─────────────────────────────────────────────────────── */
export default function Home() {
  const [search,             setSearch]             = useState('')
  const [categories,         setCategories]         = useState([])
  const [loadingCategories, setLoadingCategories]   = useState(true)
  const [selectedCategory,   setSelectedCategory]   = useState('')
  const [foods,              setFoods]              = useState([])
  const [loadingFoods,       setLoadingFoods]       = useState(true)
  const [foodError,          setFoodError]          = useState(null)   // null | 'server' | 'empty'
  const navigate = useNavigate()

  // Fetch real categories from the database API
  useEffect(() => {
    let isMounted = true
    setLoadingCategories(true)
    api.get('/categories')
      .then(res => {
        if (isMounted) {
          setCategories(res.data?.categories || [])
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategories([])
        }
      })
      .finally(() => {
        if (isMounted) setLoadingCategories(false)
      })

    return () => { isMounted = false }
  }, [])

  // Fetch real foods matching the selected category or popular foods
  useEffect(() => {
    let isMounted = true
    setLoadingFoods(true)
    setFoodError(null)

    const params = { limit: 12 }
    if (selectedCategory) {
      params.categoryName = selectedCategory
    } else {
      params.sort = 'rating'
    }

    api.get('/foods', { params })
      .then(r => {
        if (!isMounted) return
        const foodList = r.data?.foods || []
        setFoods(foodList)
        setFoodError(foodList.length === 0 ? 'empty' : null)
      })
      .catch(err => {
        if (!isMounted) return
        const isNetworkErr = !err.response
        const is5xx = err.response?.status >= 500
        setFoodError(isNetworkErr || is5xx ? 'server' : 'empty')
        setFoods([])
      })
      .finally(() => {
        if (isMounted) setLoadingFoods(false)
      })

    return () => { isMounted = false }
  }, [selectedCategory])

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(prev => (prev === categoryName ? '' : categoryName))
  }

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
              <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
                Free delivery on your first order
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
                Good food,<br />
                <span className="text-orange-500">delivered simply.</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl">
                Discover delicious meals, order your favourites, and enjoy great food without the hassle.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
                >
                  Explore Menu <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-orange-300 text-gray-700 hover:text-orange-500 font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
                >
                  View Cart
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                <div className="absolute inset-0 bg-orange-200 rounded-full opacity-30 blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop"
                  alt="Assorted dishes on a table"
                  className="relative w-full h-full object-cover rounded-full shadow-2xl border-8 border-white"
                />
                <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2.5 border border-gray-100">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Fast Delivery</p>
                    <p className="text-xs text-gray-400">30 min avg</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2.5 border border-gray-100">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Top Rated</p>
                    <p className="text-xs text-gray-400">4.8 / 5</p>
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
          <form
            onSubmit={handleSearch}
            className="relative flex items-center shadow-md rounded-xl border border-gray-200 overflow-hidden bg-white"
          >
            <Search className="absolute left-5 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for dishes or categories…"
              aria-label="Search food"
              className="w-full py-4 pl-14 pr-4 text-sm text-gray-700 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-4 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────── */}
      <section className="py-14 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-orange-500 text-sm font-semibold mb-1 uppercase tracking-wide">
                Browse by category
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Food Categories</h2>
            </div>
            <div className="flex items-center gap-3">
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className="text-xs font-semibold text-gray-600 hover:text-orange-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:border-orange-300 transition-colors cursor-pointer"
                >
                  Clear filter ({selectedCategory})
                </button>
              )}
              <Link
                to="/menu"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                View all in Menu <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Loading categories */}
          {loadingCategories && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Categories loaded */}
          {!loadingCategories && categories.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name
                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`group relative flex flex-col items-center p-3 sm:p-3.5 rounded-2xl transition-all duration-200 text-center cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50 border-2 border-orange-500 shadow-md ring-2 ring-orange-200 -translate-y-1'
                        : 'bg-white border border-gray-200/80 hover:border-orange-300 hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 mb-2.5 shadow-sm flex-shrink-0">
                      <img
                        src={cat.image || NEUTRAL_CATEGORY_FALLBACK}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          if (e.target.src !== NEUTRAL_CATEGORY_FALLBACK) {
                            e.target.src = NEUTRAL_CATEGORY_FALLBACK
                          }
                        }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-orange-500/20 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-600 ring-2 ring-white" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs sm:text-sm font-semibold leading-tight line-clamp-1 transition-colors ${
                      isSelected ? 'text-orange-600 font-bold' : 'text-gray-800 group-hover:text-orange-500'
                    }`}>
                      {cat.name}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Empty categories */}
          {!loadingCategories && categories.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-500">
              Unable to load food categories at this time.
            </div>
          )}
        </div>
      </section>

      {/* ── PRODUCT / FOOD SECTION ───────────────────────────────────── */}
      <section id="dishes" className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-orange-500 text-sm font-semibold mb-1 uppercase tracking-wide">
                {selectedCategory ? `Category: ${selectedCategory}` : 'Highest rated'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {selectedCategory ? `${selectedCategory}` : 'Popular Dishes'}
              </h2>
              {selectedCategory && (
                <p className="text-gray-500 text-sm mt-1">
                  Showing delicious {selectedCategory.toLowerCase()} options from our menu.
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Show all dishes
                </button>
              )}
              <Link
                to={selectedCategory ? `/menu?category=${encodeURIComponent(selectedCategory)}` : '/menu'}
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                View all in Menu <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Loading */}
          {loadingFoods && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <FoodCardSkeleton key={i} />)}
            </div>
          )}

          {/* Server / network error */}
          {!loadingFoods && foodError === 'server' && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center max-w-lg mx-auto">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="font-semibold text-red-700 mb-1">Unable to load the menu</p>
              <p className="text-sm text-red-500 mb-4">Please try again in a moment.</p>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Go to Menu
              </Link>
            </div>
          )}

          {/* Empty state */}
          {!loadingFoods && (!foodError || foodError === 'empty') && foods.length === 0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-12 text-center max-w-lg mx-auto">
              <p className="font-medium text-gray-700 mb-2">No dishes available</p>
              <p className="text-sm text-gray-400">Check back soon or browse the full menu.</p>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className="inline-flex items-center gap-2 mt-4 text-xs font-semibold text-orange-600 bg-white border border-orange-200 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  View all dishes
                </button>
              )}
              <div className="mt-4">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            </div>
          )}

          {/* Foods loaded */}
          {!loadingFoods && foods.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {foods.map(food => <FoodCard key={food._id} food={food} />)}
              </div>
              <div className="text-center mt-10">
                <Link
                  to={selectedCategory ? `/menu?category=${encodeURIComponent(selectedCategory)}` : '/menu'}
                  className="inline-flex items-center gap-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                >
                  {selectedCategory ? `View all ${selectedCategory} in Menu` : 'View Full Menu'} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-semibold mb-1 uppercase tracking-wide">Why FoodieHub</p>
            <h2 className="text-2xl font-bold text-gray-900">Built for a great experience</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              Simple, fast, and reliable — every time you order.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-6 border border-gray-100 text-center hover:border-orange-200 transition-colors"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ─────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-500 rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-10 lg:p-14">
                <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
                  New member offer
                </span>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 leading-tight">
                  20% off your first order
                </h2>
                <p className="text-orange-100 mb-6 text-sm leading-relaxed">
                  Create an account and use code{' '}
                  <strong className="text-white bg-white/20 px-1.5 py-0.5 rounded font-mono">WELCOME20</strong>{' '}
                  at checkout.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white text-orange-500 hover:bg-orange-50 font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="hidden md:flex items-center justify-center p-10">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop"
                  alt="A spread of food dishes"
                  className="w-60 h-60 object-cover rounded-full shadow-2xl border-8 border-white/20"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
