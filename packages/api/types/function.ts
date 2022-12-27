import { useAccessControl } from '../core/access/use'
import type { ApiContext } from './server'

export type FunctionPath = `${string}@${string}`

export type ApiContextWithAC = ApiContext & {
  access: ReturnType<typeof useAccessControl>
}

export type ApiFunction<Props=unknown, Return={}> = (
  props: Props,
  context: ApiContext
) => Return
