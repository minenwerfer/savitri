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

  public override async insert(props: { what: any }, res: unknown, decodedToken: any) {
    props.what.user_id = decodedToken._id
    return super.insert.call(this, props)
  }

  public async ping(props: { last_id: string }, res: unknown, decodedToken: any) {
    if( !decodedToken?._id ) {
      return {}
    }

    return (super.getAll.call(this, {
      filter: {
        destination: decodedToken._id,
        // _id: { $gt: props.last_id }
      }

    }) as any).select({ destination: 0 })
  }
}
