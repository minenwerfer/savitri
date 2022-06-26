import { Document, model, options } from '../../core/database'
import { descriptionToSchema } from '../../core/entity'
import { default as Description } from './index.json'

import { UserDocument } from '../user/user.model'
import '../user/user.model'

export interface NotificationDocument extends Document {
  user_id: UserDocument | string
  destination: UserDocument | string
  title: string
  content: string
  action: string
  subject: string
}


export const NotificationSchema = descriptionToSchema<NotificationDocument>(Description, options)
export const Notification = model<NotificationDocument>('notification', NotificationSchema)
