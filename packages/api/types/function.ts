import type { DecodedToken } from './server'

export type CollectionFunction<Props> = (
  props: Props,
  decodedToken: DecodedToken,
  apiConfig: Record<string, any>
) => any
