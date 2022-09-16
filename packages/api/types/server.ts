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

export type DecodedToken = {
  user: UserDocument
  extra: any
}

export type Roles = Record<string, {
  grantEverything?: boolean
  capabilities?: {
    grantEverything?: boolean
    methods?: Array<string>
  }
}>


export type ApiConfig = {
  group?: string
  roles?: Roles
  allowSignup?: boolean
  signupDefaults?: {
    role: string
    active: boolean
  }
  populateUserExtra?: Array<string>

  beforeRead?: (token: DecodedToken, collectionName: string) => Record<string, any>
  beforeWrite?: (token: DecodedToken, collectionName: string) => Record<string, any>
}

export type ProvidedParams = Record<string, any> & {
  apiConfig: ApiConfig
}

