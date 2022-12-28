import { useAccessControl } from '../core/access/use'
import type { MaybeCollectionDescription } from '../../types'
import type { Log } from '../../system/collections/log/log.description'
import type { CollectionFunctions } from '../core/collection/functions.types'
import type { ApiConfig, DecodedToken } from './server'

export type FunctionPath = `${string}@${string}`

export type ApiContextWithAC = ApiContext & {
  access: ReturnType<typeof useAccessControl>
}

export type ApiFunction<Props=unknown, Return={}> = (
  props: Props,
  context: ApiContext
) => Return

export type AnyFunctions = CollectionFunctions & Record<string, (props?: any) => any>

export type ApiContext = {
  apiConfig: ApiConfig
  injected: Record<string, any>
  token: DecodedToken

  collection: CollectionFunctions
  entity: AnyFunctions
  log: (message: string, details?: Record<string, any>) => Promise<Log>
  collections: Record<string, AnyFunctions>
  controllables: Record<string, AnyFunctions>

  descriptions?: Record<string, MaybeCollectionDescription>
}

