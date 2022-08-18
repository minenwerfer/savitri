import type { CollectionDescription } from '../../common/types/collection'
import collectionActions from '../core/store/actions'
import collectionGetters from '../core/store/getters'

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

export type ValidationError = {
  type: string
  detail: string
}

export type ValidationErrors = Record<string, ValidationError>

export type CollectionState<Item> = PiniaState & {
  item: Item|object
  freshItem: Partial<Item>
  items: Array<Item>
  filters: Partial<Item>

  selected: Array<Item>

  queryCache: Record<string, any>
  description: Readonly<Partial<CollectionDescription>>
  rawDescription: Readonly<Partial<CollectionDescription>>

  validationErrors: ValidationErrors

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

export type CollectionStore<T=any> = CollectionState<T>
  & typeof collectionActions
  & typeof collectionGetters
