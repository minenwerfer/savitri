import { Document, model, options } from '../../database'
import { descriptionToSchema } from '../_Util'
import { default as Description } from '../../../../data/entities/common/Report/index.json'
export { Description }

import { UserDocument } from '../User'
import '../User'

export interface ReportDocument extends Document {
  user_id: UserDocument | string
  module: string
}


export const ReportSchema = descriptionToSchema<ReportDocument>(Description, options)
ReportSchema.plugin(require('mongoose-autopopulate'))

export const Report = model<ReportDocument>('Report', ReportSchema)
