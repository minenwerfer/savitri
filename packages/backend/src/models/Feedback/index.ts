import { Document, model, options } from '../../database'
import { descriptionToSchema } from '../_Util'
import { default as Description } from '../../../../data/models/common/Feedback/index.json'
export { Description }

import { UserDocument } from '../User'
import '../User'

export interface FeedbackDocument extends Document {
  user_id: UserDocument;
  comment: string;
}

export const FeedbackSchema = descriptionToSchema<FeedbackDocument>(Description, options)
FeedbackSchema.plugin(require('mongoose-autopopulate'))

export const Feedback = model<FeedbackDocument>('Feedback', FeedbackSchema)
