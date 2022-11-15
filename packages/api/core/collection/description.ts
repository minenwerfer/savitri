import type { MaybeCollectionDescription } from '../../../common/types'
import type { SchemaProperties } from './schema.types'

export const makeDescription = <
  T,
  A=SchemaProperties<T>,
  Description=Omit<MaybeCollectionDescription, keyof A>
>(schema: A, description: Description): A & Description => ({
  ...schema,
  ...description
})
