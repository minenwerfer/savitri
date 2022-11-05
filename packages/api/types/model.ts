import type { ObjectId } from 'mongoose'

export type MongoDocument = {
  _id: ObjectId|string
  created_at?: Date
  updated_at?: Date
}

export {
  ObjectId
}
