import { createModel, MongoDocument } from '../../../api'
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


export default createModel<ReportDocument>('report', Description)
