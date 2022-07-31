import type { Request } from '@hapi/hapi'
import type { UserDocument } from '../../collections/user/user.model'

export type HandlerRequest = Request & {
  payload: {
    offset?: number
    limit?: number
    filters?: any
    what?: any
  }
}

export type DecodedToken = UserDocument
