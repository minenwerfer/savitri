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

export type DecodedToken = {
  user: User
  extra: any
}

export type Role = {
  grantEverything?: boolean
  capabilities?: Record<string, {
    grantEverything?: boolean
    methods?: Array<string>
  }>
}

export type Roles = Record<string, Role>

export type ApiConfig = {
  group?: string
  roles?: Roles
  allowSignup?: boolean
  signupDefaults?: {
    role: string
    active: boolean
  }
  populateUserExtra?: Array<string>
  dynamicCollections?: boolean

  beforeRead?: (token: DecodedToken, collectionName: string) => Record<string, any>
  beforeWrite?: (token: DecodedToken, collectionName: string) => Record<string, any>
}

export type ProvidedParams = Record<string, any> & {
  apiConfig: ApiConfig
}

