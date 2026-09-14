import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, ArrowLeft, Star, Clock, Leaf, ChevronRight, Send } from 'lucide-react'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import FoodCard from '../components/food/FoodCard'
import { PageSpinner } from '../components/common/Spinner'
import toast from 'react-hot-toast'

export default function FoodDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [food, setFood] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Review form state
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewHover, setReviewHover] = useState(0)
  const [submittingReview, setSubmittingReview] = useState(false)

  const fallback = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop'

  const loadFood = () => {
    setLoading(true)
    setFood(null)
    setQty(1)
    setImgError(false)
    api.get(`/foods/${id}`)
      .then(r => {
        const fetchedFood = r.data.food
        setFood(fetchedFood)
        // BUG FIX: actually pass category ID to the related foods query
        const catId = fetchedFood.category?._id
        if (catId) {
          api.get('/foods', { params: { category: catId, limit: 5, sort: 'rating' } })
            .then(r2 => setRelated((r2.data.foods || []).filter(f => f._id !== id).slice(0, 4)))
            .catch(() => { })
        }
      })
      .catch(() => navigate('/menu'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadFood() }, [id]) // id change triggers a full reload

  const handleAddToCart = () => {
    setAdding(true)
    addToCart(food, qty)
    setTimeout(() => setAdding(false), 600)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please log in to leave a review'); return }
    if (!reviewComment.trim()) { toast.error('Please write a comment'); return }
    setSubmittingReview(true)
    try {
      await api.post(`/foods/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      })
      toast.success('Review submitted!')
      setReviewComment('')
      setReviewRating(5)
      loadFood() // refresh to show new review + updated rating
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return <PageSpinner />
  if (!food) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/menu" className="hover:text-orange-500 transition-colors">Menu</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-700 truncate max-w-[200px]">{food.name}</span>
      </div>

      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="rounded-3xl overflow-hidden bg-gray-100 aspect-square shadow-sm">
          <img
            src={imgError ? fallback : (food.image || fallback)}
            alt={food.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
              {food.category?.name}
            </span>
            {food.isVegetarian ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <Leaf className="w-3 h-3" /> Vegetarian
              </span>
            ) : (
              <span className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">Non-Veg</span>
            )}
            {!food.isAvailable && (
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Unavailable</span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{food.name}</h1>
          <p className="text-gray-500 leading-relaxed mb-5">{food.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-800">{food.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-sm text-gray-400">({food.numReviews || 0} reviews)</span>
            </div>
            {food.preparationTime && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{food.preparationTime} min</span>
              </div>
            )}
          </div>

          <div className="text-3xl font-extrabold text-gray-900 mb-8">₹{food.price}</div>

          {food.isAvailable ? (
            <div className="flex items-center gap-4">
              {/* Qty selector */}
              <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-40"
                  disabled={qty <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-gray-900 text-base">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-semibold py-3 px-6 rounded-2xl transition-colors text-base shadow-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? 'Added!' : `Add to Cart · ₹${food.price * qty}`}
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 text-gray-500 text-center py-3 px-6 rounded-2xl font-medium">
              Currently Unavailable
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Customer Reviews
          {food.numReviews > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">({food.numReviews})</span>
          )}
        </h2>

        {/* Existing reviews */}
        {food.reviews?.length > 0 ? (
          <div className="space-y-4 mb-8">
            {food.reviews.map(r => (
              <div key={r._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-orange-600">{r.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center mb-8 border border-gray-100">
            <p className="text-3xl mb-2">⭐</p>
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this dish!</p>
          </div>
        )}

        {/* Write a review */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
          {user ? (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setReviewRating(val)}
                        onMouseEnter={() => setReviewHover(val)}
                        onMouseLeave={() => setReviewHover(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${val <= (reviewHover || reviewRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-gray-200 text-gray-200'
                            }`}
                        />
                      </button>
                    )
                  })}
                  <span className="ml-2 text-sm text-gray-500 font-medium">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewHover || reviewRating]}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Comment</label>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  rows={3}
                  placeholder="Share your experience with this dish..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                {submittingReview ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-3">You need to be logged in to write a review.</p>
              <Link
                to="/login"
                state={{ from: { pathname: `/food/${id}` } }}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl transition-colors text-sm"
              >
                Log in to review
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Foods */}
      {related.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">You might also like</h2>
            <Link to={`/menu?category=${encodeURIComponent(food.category?.name || '')}`} className="text-sm text-orange-500 hover:text-orange-600 font-medium">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(f => <FoodCard key={f._id} food={f} />)}
          </div>
        </section>
      )}
    </div>
  )
}
