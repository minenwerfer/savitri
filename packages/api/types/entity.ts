import type { Model } from 'mongoose'
import type { CollectionDescription } from '../../types'
import type { ApiFunction } from './function'

export type AssetType =
  'model'
  | 'description'
  | 'function'


export type EntityType =
  'collection'
  | 'controllable'

export type AssetReturnType<Type> = Type extends 'function'
  ? ApiFunction<any, Promise<any>> : Type extends 'description'
  ? CollectionDescription : Type extends 'model'
  ? Model<any> : never

