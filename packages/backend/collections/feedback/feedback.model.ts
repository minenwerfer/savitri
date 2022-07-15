import { Document, model, options } from '../../core/database'
import { descriptionToSchema } from '../../core/collection'
import { default as Description } from './index.json'

import { UserDocument } from '../user/user.model'
import '../user/user.model'

export interface FeedbackDocument extends Document {
  user_id: UserDocument
  comment: string
}

export const FeedbackSchema = descriptionToSchema<FeedbackDocument>(Description, options)
export const Feedback = model<FeedbackDocument>('feedback', FeedbackSchema)
