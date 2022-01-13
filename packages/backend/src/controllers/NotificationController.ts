import { Mutable } from './abstract/Mutable'
import { NotificationDocument, Notification, Description } from '../models/Notification'

export class NotificationController extends Mutable<NotificationDocument> {
  constructor() {
    super(Notification, Description, {
      publicMethods: [
        'ping'
      ]
    })
  }

  public notify(props: { destination: string, title: string, content: string, action?: string, subject?: string }, res: unknown, decodedToken: any) {
    const { destination, ...payload } = props

    return super.insert.call(this, {
      what: {
        user_id: decodedToken._id,
        destination,
        ...payload
      }

    } as any)
  }

  public ping(props: { last_id: string }, res: unknown, decodedToken: any) {
    if( !decodedToken?._id ) {
      return {}
    }

    return super.get.call(this, {
      filter: {
        user_id: decodedToken._id,
        _id: { $gt: props.last_id }
      }
    })
  }
}
