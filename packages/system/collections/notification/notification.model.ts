import { createModel } from '../../../api/core/collection'
import { Notification, NotificationDescription } from './notification.description'
import '../user/user.model'

export default createModel<Notification>(NotificationDescription)
