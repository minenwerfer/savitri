import { Mutable } from '../../../api/core/controller'
import type { DecodedToken } from '../../../api/types'
import { RequestProvider } from '../../../common/http'
import { TokenService } from '../../../api/core/token'
import { Notification, NotificationDescription } from './notification.description'
import NotificationModel from './notification.model'

import path from 'path'
const buildConfig = require(path.join(process.cwd(), 'build.json'))

export class NotificationController extends Mutable<Notification> {
  private http: RequestProvider

  constructor() {
    super(NotificationModel, NotificationDescription)
    this.http = new RequestProvider({ baseURL: process.env.DOMAIN_API_URL })
  }

  public async ping(
    props: {
      last_id: string
      localOnly: boolean
    },
  token: DecodedToken
  ) {
    const result = {
      local: [],
      domain: []
    }

    if( !props.localOnly && buildConfig.domain && buildConfig.domainNotifications ) {
      if( !this.http.token ) {
        this.http.token = await TokenService.sign(token, process.env.DOMAIN_SECRET) as string
      }

      const { data: { result: { local } } } = await this.http.post('/notification/ping', { localOnly: true })
      result.domain = local
    }

    result.local = await (super.getAll.call(this, {
      filters: {
        $or: [
          { destination: token.user._id },
          { destination: null }
        ],

        ...(props.last_id ? { _id: { $gt: props.last_id } } : {})
      }

    }) as any).select({ destination: 0 })

    return result
  }
}
