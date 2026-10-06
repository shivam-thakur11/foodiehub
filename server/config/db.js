import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('CRITICAL: MONGO_URI environment variable is not defined.')
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB runtime error: ${err.message}`)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Waiting for reconnection...')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully.')
    })
  } catch (error) {
    console.error(`MongoDB initial connection error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
