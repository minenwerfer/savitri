import { Description as UserDescription } from './models/User'
import { Description as AccessProfileDescription } from './models/AccessProfile'
import { Description as FeedbackDescription } from './models/Feedback'
import { Description as FileDescription } from './models/File'
import { Description as NotificationDescription } from './models/Notification'
import { Description as ReportDescription } from './models/Report'
import { default as ReleaseDescription } from '../../data/entities/common/Release/index.json'

export const defaultDescriptions = {
  user: UserDescription,
  accessProfile: AccessProfileDescription,
  feedback: FeedbackDescription,
  file: FileDescription,
  notification: NotificationDescription,
  report: ReportDescription,
  release: ReleaseDescription
}

