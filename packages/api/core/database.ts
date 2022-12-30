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


export const connectDatabase = async () => {
  const MONGODB_URI = await (async () => {
    const envURI = process.env.MONGODB_URI
    if( !envURI ) {
      console.warn(
        `mongo URI wasn't supplied, fallbacking to memory storage`
      )

      const { MongoMemoryServer } = require('mongodb-memory-server')
      const mongod = await MongoMemoryServer.create()
      return mongod.getUri()
    }

    return process.env.MO
  })()

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
