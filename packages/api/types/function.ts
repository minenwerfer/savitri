import { useAccessControl } from '../core/access/use'
import type { DecodedToken, ApiContext } from './server'

export type FunctionPath = `${string}@${string}`

export type ApiContextWithAC = ApiContext & {
  access: ReturnType<typeof useAccessControl>
}

export type ApiFunction<Props, Return={}> = (
  props: Props,
  decodedToken: DecodedToken|null,
  context: ApiContext
) => Return
