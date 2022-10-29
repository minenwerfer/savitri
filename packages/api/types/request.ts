import type { Request } from '@hapi/hapi'
import type { UserDocument } from '../../system/collections/user/user.model'

export type HandlerRequest = Request & {
  payload: {
    offset?: number
    limit?: number
    filters?: any
    what?: any
  }
}

export type DecodedToken = UserDocument


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

