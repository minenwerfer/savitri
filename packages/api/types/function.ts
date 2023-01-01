import { useAccessControl } from '../core/access/use'
import type { ResponseToolkit } from '@hapi/hapi'
import type { MaybeCollectionDescription } from '../../types'
import type { Log } from '../../system/collections/log/log.description'
import type { CollectionFunctions } from '../core/collection/functions.types'
import type { ApiConfig, DecodedToken } from './server'

export type FunctionPath = `${string}@${string}`

export type ApiFunction<Props=unknown, Return={}> = (
  props: Props,
  context: ApiContext
) => Return

export type AnyFunctions = CollectionFunctions & Record<string, (props?: any) => any>

export type Role = {
  grantEverything?: boolean
  capabilities?: Record<string, {
    grantEverything?: boolean
    methods?: Array<string>
    blacklist?: Array<string>
  }>
}

export type Roles = Record<string, Role>

export type AccessControl = {
  roles?: Roles
  beforeRead?: (token: DecodedToken, collectionName: string) => Record<string, any>
  beforeWrite?: (token: DecodedToken, collectionName: string) => Record<string, any>
}

export type ApiContext = {
  apiConfig: ApiConfig
  accessControl: AccessControl
  injected: Record<string, any>
  token: DecodedToken

  validate: <T>(what: T, required?: Array<keyof T>) => void
  collection: CollectionFunctions
  entity: AnyFunctions
  log: (message: string, details?: Record<string, any>) => Promise<Log>
  collections: Record<string, AnyFunctions>
  controllables: Record<string, AnyFunctions>

  descriptions?: Record<string, MaybeCollectionDescription>
  response: ResponseToolkit
}

export type ApiContextWithAC = ApiContext & {
  acFunctions: ReturnType<typeof useAccessControl>
}

