import { Document, model, options } from '../../src/database'
import { descriptionToSchema } from '../../src/entity'
import { default as Description } from './index.json'

import { UserDocument } from '../user/user.mdl'
import '../user/user.mdl'

export interface ReportDocument extends Document {
  user_id: UserDocument | string
  module: string
}


export const ReportSchema = descriptionToSchema<ReportDocument>(Description, options)
export const Report = model<ReportDocument>('Report', ReportSchema)
