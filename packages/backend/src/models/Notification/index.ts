import { Document, model, options } from '../../database'
import { descriptionToSchema } from '../_Util'
import { default as Description } from '../../../../data/models/common/Notification/index.json'
export { Description }

import { UserDocument } from '../User'
import '../User'

export interface NotificationDocument extends Document {
  user_id: UserDocument
  title: string
  content: string
  action: string
  subject: string
}


export const NotificationSchema = descriptionToSchema<NotificationDocument>(Description, options)
NotificationSchema.plugin(require('mongoose-autopopulate'))

export const Notification = model<NotificationDocument>('Notification', NotificationSchema)
