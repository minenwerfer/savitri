import type { MongoDocument } from '../../api/types'
import { model, options } from '../../api/core/database'
import { descriptionToSchema } from '../../api/core/collection'
import { default as Description } from './index.json'

import { UserDocument } from '../user/user.model'
import '../user/user.model'

export type ReportDocument = MongoDocument & {
  owner: UserDocument | MongoDocument['_id']
  _collection: string
  format: string
  type: string
  limit: number
  offset: number
  filters: object
  entries_count: number
}


export const ReportSchema = descriptionToSchema<ReportDocument>(Description, options)
export const Report = model<ReportDocument>('report', ReportSchema)
