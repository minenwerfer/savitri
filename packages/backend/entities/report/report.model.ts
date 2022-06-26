import { Document, model, options } from '../../core/database'
import { descriptionToSchema } from '../../core/entity'
import { default as Description } from './index.json'

import { UserDocument } from '../user/user.model'
import '../user/user.model'

export interface ReportDocument extends Document {
  user_id: UserDocument | string
  module: string
}


export const ReportSchema = descriptionToSchema<ReportDocument>(Description, options)
export const Report = model<ReportDocument>('report', ReportSchema)
