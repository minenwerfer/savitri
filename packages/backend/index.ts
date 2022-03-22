export * from './src/controllers/abstract/Mutable'
export * from './src/controllers/abstract/Controller'

export * from './src/models/_Util'
export * as mongoose from './src/database'
export { options  } from './src/database'

export * from './src/services'

import { Description as UserDescription } from './src/models/User'
import { Description as AccessProfileDescription } from './src/models/AccessProfile'
import { Description as FeedbackDescription } from './src/models/Feedback'
import { Description as FileDescription } from './src/models/File'
import { Description as NotificationDescription } from './src/models/Notification'
import { Description as ReportDescription } from './src/models/Report'
import { default as ReleaseDescription } from '../data/entities/common/Release/index.json'

export const defaultDescriptions = {
  user: UserDescription,
  accessProfile: AccessProfileDescription,
  feedback: FeedbackDescription,
  file: FileDescription,
  notification: NotificationDescription,
  report: ReportDescription,
  release: ReleaseDescription
}

