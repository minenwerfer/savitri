import { Mutable } from '../../api/core/controller'
import { NotificationDocument, Notification } from './notification.model'
import { RequestProvider } from '../../common/src/http'
import { TokenService } from '../../api/core/services/token.service'
import { default as Description } from './index.json'

const path = require('path')
const buildConfig = require(path.join(process.cwd(), 'build.json'))

export interface NotificationController {
  http: RequestProvider
}

export class NotificationController extends Mutable<NotificationDocument> {
  constructor() {
    super(Notification, Description, {
      publicMethods: [
        'ping'
      ]
    })

    this.http = new RequestProvider({ baseURL: process.env.DOMAIN_API_URL })
  }

  public async ping(props: { last_id: string, localOnly: boolean }, res: unknown, decodedToken: any) {
    if( !decodedToken?._id ) {
      return {}
    }

    const result: { local: any, domain?: any } = {
      local: [],
      domain: []
    }

    if( !props.localOnly && buildConfig.domain && buildConfig.domainNotifications ) {
      if( !this.http.token ) {
        delete decodedToken.iat
        delete decodedToken.exp
        this.http.token = await TokenService.sign(decodedToken, process.env.DOMAIN_SECRET) as string
      }

      const { data: { result: { local } } } = await this.http.post('/notification/ping', { localOnly: true })
      result.domain = local
    }

    result.local = await (super.getAll.call(this, {
      filters: {
        $or: [
          { destination: decodedToken._id },
          { destination: null }
        ],

        ...(props.last_id ? { _id: { $gt: props.last_id } } : {})
      }

    }) as any).select({ destination: 0 })

    return result
  }
}
