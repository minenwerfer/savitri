const mongoose = require('mongoose')
export * from 'mongoose'

const { MONGODB_URI } = process.env

mongoose.Promise = global.Promise
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

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
