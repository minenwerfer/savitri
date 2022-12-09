import type { DecodedToken, ApiConfig } from './server'

export type CollectionFunction<Props> = (
  props: Props,
  decodedToken: DecodedToken|null,
  apiConfig: ApiConfig
) => any
