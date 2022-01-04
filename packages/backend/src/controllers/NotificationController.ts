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

  ping(props: { last_id: string }, res: unknown, decodedToken: any) {
    return decodedToken

    // if( !decodedToken?._id ) {
    //   return {}
    // }

    // return super.get.call(this, {
    //   filter: {
    //     user_id: decodedToken._id,
    //     _id: { $gt: props.last_id }
    //   }
    // })
  }
}
