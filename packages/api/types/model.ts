import type { ObjectId } from 'mongoose'

export type MongoDocument = {
  _id: ObjectId|string
  created_at?: Date
  update_at?: Date
}
