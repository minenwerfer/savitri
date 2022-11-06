import { createModel } from '../../../api/core/collection'
import { Notification, Description } from './notification.schema'
import '../user/user.model'

export default createModel<Notification>(Description)
