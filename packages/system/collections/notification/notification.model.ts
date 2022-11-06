import { createModel } from '../../../api/core/collection'
import { Notification, NotificationDescription } from './notification.schema'
import '../user/user.model'

export default createModel<Notification>(NotificationDescription)
