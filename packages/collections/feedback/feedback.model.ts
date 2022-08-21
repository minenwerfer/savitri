import type { MongoDocument } from '../../api/types'
import { model, options } from '../../api/core/database'
import { descriptionToSchema } from '../../api/core/collection'
import { default as Description } from './index.json'

import { UserDocument } from '../user/user.model'
import '../user/user.model'

export type FeedbackDocument = MongoDocument & {
  owner: UserDocument
  comment: string
}

export const FeedbackSchema = descriptionToSchema<FeedbackDocument>(Description, options)
export const Feedback = model<FeedbackDocument>('feedback', FeedbackSchema)
