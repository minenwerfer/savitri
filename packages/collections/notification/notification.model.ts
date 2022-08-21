import type { MongoDocument } from '../../api/types'
import { model, options } from '../../api/core/database'
import { descriptionToSchema } from '../../api/core/collection'
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


export const NotificationSchema = descriptionToSchema<NotificationDocument>(Description, options)
export const Notification = model<NotificationDocument>('notification', NotificationSchema)
