import type { Request } from '@hapi/hapi'
import type { User } from '../../system/collections/user/user.schema'

export type HandlerRequest = Request & {
  payload: {
    offset?: number
    limit?: number
    filters?: any
    what?: any
  }
}

export type DecodedToken = User


export type ProvidedParams = Record<string, any> & {
  config?: {
    group?: string
    roles?: Array<string>
    allowSignup?: boolean
    signupDefaults?: {
      role?: string
      active?: boolean
    }
  }
}

