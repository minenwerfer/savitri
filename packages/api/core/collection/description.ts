import type { CollectionDescription } from '../../../common/types'
import type { SchemaFields } from './schema.types'

export const makeDescription = <
  T,
  A=SchemaFields<T>,
  Description=Omit<CollectionDescription, keyof A>
>(schema: A, description: Description): A & Description => ({
  ...schema,
  ...description
})
