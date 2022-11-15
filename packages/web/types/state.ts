import type { CollectionDescription, CollectionReference } from '../../common/types/collection'
import collectionActions from '../core/state/actions'
import collectionGetters from '../core/state/getters'

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
  freshFilters: any
  activeFilters: any

  selected: Array<Item>

  queryCache: Record<string, any>
  description: Readonly<Partial<CollectionDescription>>
  rawDescription: Readonly<Partial<CollectionDescription>>

  validationErrors: ValidationErrors

  isLoading: boolean
  halt: boolean

  pagination: Pagination
}

export type CollectionGetters = {
  properties: CollectionDescription['properties']
  $filters: CollectionState<unknown>['filters']
  inlineReferences: Array<[string, CollectionReference]>
}

export type CollectionStore<T=any> = CollectionState<T>
  & typeof collectionActions
  & typeof collectionGetters

export type CollectionStructure<T=any> = CollectionState<T> & {
  getters?: any
  actions?: any
}
