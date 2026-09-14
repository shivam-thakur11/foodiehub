import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import api from '../services/api'
import FoodCard from '../components/food/FoodCard'
import { FoodCardSkeleton } from '../components/common/Skeleton'
import EmptyState from '../components/common/EmptyState'

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low–High' },
  { value: 'price_desc', label: 'Price: High–Low' },
]

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)   // true only on network / 5xx
  const [filtersOpen, setFiltersOpen] = useState(false)

  // ── URL-synced filter state ───────────────────────────────────────────────
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'createdAt'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const rating = searchParams.get('rating') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const veg = searchParams.get('veg') || ''

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    if (key !== 'page') p.delete('page')   // reset to page 1 on filter change
    setSearchParams(p)
  }

  // ── Fetch foods ────────────────────────────────────────────────────────────
  const fetchFoods = useCallback(async () => {
    setLoading(true)
    setApiError(false)
    try {
      const params = { page, limit: 12, sort }
      if (search) params.search = search
      if (category) params.categoryName = category   // server looks up by name
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice
      if (rating) params.rating = rating
      if (veg === 'true') params.isVegetarian = 'true'

      const res = await api.get('/foods', { params })
      setFoods(res.data.foods || [])
      setPagination(res.data.pagination || {})
    } catch (err) {
      const isNetworkErr = !err.response
      const is5xx = err.response?.status >= 500
      if (isNetworkErr || is5xx) {
        setApiError(true)
      }
      setFoods([])
      setPagination({})
    } finally {
      setLoading(false)
    }
  }, [search, category, sort, minPrice, maxPrice, rating, page, veg])

  useEffect(() => { fetchFoods() }, [fetchFoods])

  // Fetch categories once for the filter panel dropdown
  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data.categories || []))
      .catch(() => { })
  }, [])

  const clearFilters = () => setSearchParams(new URLSearchParams())
  const hasFilters = search || category || minPrice || maxPrice || rating || veg

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Explore Our Menu</h1>
        <p className="text-gray-500 mt-1">
          {pagination.total != null
            ? `${pagination.total} item${pagination.total !== 1 ? 's' : ''} available`
            : 'Browse our delicious selection'}
        </p>
      </div>

      {/* Search + Sort + Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setParam('search', e.target.value)}
            placeholder="Search food, e.g. pizza, biryani, burger…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
        </div>
        <select
          value={sort}
          onChange={e => setParam('sort', e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button
          onClick={() => setFiltersOpen(v => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${filtersOpen ? 'bg-orange-50 border-orange-300 text-orange-600' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-orange-500" />}
        </button>
      </div>

      {/* Expanded filter panel */}
      {filtersOpen && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Category</label>
            <select
              value={category}
              onChange={e => setParam('category', e.target.value)}
              className="w-full border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {/* Min price */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Min Price (₹)</label>
            <input
              type="number" value={minPrice} min="0" placeholder="0"
              onChange={e => setParam('minPrice', e.target.value)}
              className="w-full border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Max price */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Max Price (₹)</label>
            <input
              type="number" value={maxPrice} min="0" placeholder="1000"
              onChange={e => setParam('maxPrice', e.target.value)}
              className="w-full border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Min rating */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Min Rating</label>
            <select
              value={rating}
              onChange={e => setParam('rating', e.target.value)}
              className="w-full border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Any</option>
              {[3, 3.5, 4, 4.5].map(r => <option key={r} value={r}>{r}+ ⭐</option>)}
            </select>
          </div>

          {/* Veg + Clear */}
          <div className="flex flex-col gap-3 justify-end">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox" checked={veg === 'true'}
                onChange={e => setParam('veg', e.target.checked ? 'true' : '')}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
              />
              Vegetarian only
            </label>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium"
              >
                <X className="w-3 h-3" /> Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            search && [`Search: "${search}"`, 'search'],
            category && [`Category: ${category}`, 'category'],
            minPrice && [`Min: ₹${minPrice}`, 'minPrice'],
            maxPrice && [`Max: ₹${maxPrice}`, 'maxPrice'],
            rating && [`Rating: ${rating}+`, 'rating'],
            veg && ['Veg only', 'veg'],
          ].filter(Boolean).map(([label, key]) => (
            <span
              key={key}
              className="flex items-center gap-1.5 text-xs bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-full font-medium"
            >
              {label}
              <button onClick={() => setParam(key, '')} className="hover:text-orange-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ── Food grid ───────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => <FoodCardSkeleton key={i} />)}
        </div>
      ) : apiError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="font-semibold text-red-700 mb-1">Cannot reach the server</p>
          <p className="text-sm text-red-500 mb-4">
            Make sure the backend is running:<br />
            <code className="bg-red-100 px-2 py-0.5 rounded text-xs mt-1 inline-block">cd server &amp;&amp; npm run dev</code>
          </p>
          <button
            onClick={fetchFoods}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      ) : foods.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title="No foods found"
          description={hasFilters ? 'Try adjusting your filters or search query.' : 'The menu is empty. Run npm run seed in the server directory.'}
          actionLabel={hasFilters ? 'Clear Filters' : undefined}
          onAction={hasFilters ? clearFilters : undefined}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {foods.map(food => <FoodCard key={food._id} food={food} />)}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setParam('page', String(page - 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '…' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setParam('page', String(p))}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${p === page ? 'bg-orange-500 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setParam('page', String(page + 1))}
                disabled={page >= pagination.pages}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
