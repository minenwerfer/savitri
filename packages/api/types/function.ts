import { useAccessControl } from '../core/mutable/access'
import type { DecodedToken, ApiContext } from './server'

export type ApiContextWithAC = ApiContext & {
  access: ReturnType<typeof useAccessControl>
}

export type ApiFunction<Props> = (
  props: Props,
  decodedToken: DecodedToken|null,
  context: ApiContext
) => any
