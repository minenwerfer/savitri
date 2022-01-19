import { Mutable } from './abstract/Mutable'
import { NotificationDocument, Notification, Description } from '../models/Notification'
import { RequestProvider } from '../../../common/src/http'
import { TokenService } from '../services/tokenService'

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

    this.http = new RequestProvider({ baseURL: process.env.DOMAIN_URL })
  }

  public override async insert(props: { what: any }, res: unknown, decodedToken: any) {
    props.what.user_id = decodedToken._id
    return super.insert.call(this, props)
  }

  public async ping(props: { last_id: string, localOnly: boolean }, res: unknown, decodedToken: any) {
    if( !decodedToken?._id ) {
      return {}
    }

    const result: { local: any, domain?: any } = {
      local: []
    }

    console.log({ decodedToken })

    if( !props.localOnly && buildConfig.domain && buildConfig.domainNotifications ) {
      if( !this.http.token ) {
        delete decodedToken.iat
        delete decodedToken.exp
        this.http.token = TokenService.sign(decodedToken)
      }

      const { data: { result: { local } } } = await this.http.post('/notification/ping', { localOnly: true })
      result.domain = local
    }

    result.local = await (super.getAll.call(this, {
      filter: {
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
