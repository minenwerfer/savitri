import { createModel, MongoDocument } from '../../../api'
import { default as Description } from './index.json'

import { UserDocument } from '../user/user.model'
import '../user/user.model'

export type NotificationDocument = MongoDocument & {
  owner: UserDocument | MongoDocument['_id']
  destination: UserDocument | MongoDocument['_id']
  title: string
  content: string
  action: string
  subject: string
}


export default createModel<NotificationDocument>('notification', Description)
