import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
)

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: { type: String, default: '' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isAvailable: { type: Boolean, default: true },
    isVegetarian: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    preparationTime: { type: Number, default: 30 },
  },
  { timestamps: true }
)

foodSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0; this.numReviews = 0
  } else {
    this.numReviews = this.reviews.length
    this.rating = this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length
  }
}

const Food = mongoose.model('Food', foodSchema)
export default Food
