import { Document, model, options } from '../../src/database'
import { descriptionToSchema } from '../../src/entity'
import { default as Description } from './index.json'

import { UserDocument } from '../user/user.mdl'
import '../user/user.mdl'

export interface FeedbackDocument extends Document {
  user_id: UserDocument;
  comment: string;
}

export const FeedbackSchema = descriptionToSchema<FeedbackDocument>(Description, options)
export const Feedback = model<FeedbackDocument>('Feedback', FeedbackSchema)
