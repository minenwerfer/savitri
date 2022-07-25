import type { Document, ObjectId } from 'mongoose'

export type MongoDocument = Omit<Document, '_id'> & {
  _id: ObjectId|string
}
