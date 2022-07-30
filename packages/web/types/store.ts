import type { CollectionDescription } from '../../common/types/collection'
import collectionActions from '../src/stores/_actions'
import collectionGetters from '../src/stores/_getters'

export type PiniaState = {
  readonly $id?: string
}

export type Pagination = {
  limit: number
  offset: number
  recordsCount: number
  recordsTotal: number
  currentPage: number
}

export type CollectionState<Item> = PiniaState & {
  item: Item|object
  freshItem: Partial<Item>
  items: Array<Item>
  filters: Partial<Item>

  selected: Array<Item>

  queryCache: Record<string, any>
  description: Readonly<Partial<CollectionDescription>>
  rawDescription: Readonly<Partial<CollectionDescription>>

  meta: {
    isLoading: boolean
    halt: boolean
  }

  pagination: Pagination
}

export type CollectionGetters = {
  fields: CollectionDescription['fields']
  $filters: CollectionState<unknown>['filters']
}

export type CollectionStore<T> = CollectionState<T>
  & typeof collectionActions
  & typeof collectionGetters
