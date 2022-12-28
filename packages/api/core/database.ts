const mongoose = require('mongoose')
export * from 'mongoose'

mongoose.Promise = global.Promise

/**
 * @exports
 * Mongoose singleton instance.
 */
export { mongoose }

/**
 * @exports
 * Options that might be used in schema creation.
 */
export const options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}


export const connectDatabase = () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
