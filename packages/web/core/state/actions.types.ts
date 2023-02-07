import type { CollectionProperty } from '@semantic-api/types'
import type { Projection } from '@semantic-api/api'
import type { CollectionStore, CollectionState } from '../../types/state'

type CrudParameters = {
  filters: any
  limit: number
  offset: number
  project?: Projection<any>
}

type ActionFilter = Partial<CrudParameters>

type ActionOptions = {
  method?:
    'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
  unproxied?: boolean
  skipLoading?: boolean
  skipEffect?: boolean
  fullResponse?: boolean
  insert?: boolean
}

export type Item = Record<string, any> & {
  _id?: string
}

type ItemId = Pick<Item, '_id'>

interface ActionsAux {
  $functions: (...args: any[]) => any
  errorPopup(e: any): Promise<any>|void
  custom(verb: string|null, payload?: string, options?: ActionOptions): Promise<any>
  customEffect(verb: string|null, payload: any, fn: (payload: any) => any, options?: ActionOptions): Promise<any>
  $customEffect(verb: string|null, payload: any, fn: (payload: any) => any, options?: ActionOptions): Promise<any>

  get(payload: ActionFilter, options?: ActionOptions): Promise<any>
  getAll(payload: ActionFilter): Promise<any>
  insert(payload?: { what: Item }, options?: ActionOptions): Promise<Item>
  deepInsert(payload?: { what: Item }): Promise<Item>
  delete(payload: { filters?: Item, _id?: ItemId }): Promise<Item>
  deleteAll(payload: { filters?: Item, _id?: ItemId }): Promise<Item>
  filter(props?: ActionFilter): Promise<any>
  updateItems(): Promise<any>
  clearFilters(): CollectionState<any>['freshFilters']
  ask(props: {
    action: (params: any) => unknown,
    params: any
    title?: string
    body?: string
  }): Promise<any>

  useProperties(properties: Array<string>): Record<string, CollectionProperty>
  usePropertiesExcept(properties: Array<string>): Record<string, CollectionProperty>
  formatValue(args: {
      value: string|object|Array<object>,
      key: string,
      form?: boolean,
      property: CollectionProperty,
      index?: string
    }
  ): string

  getIndexes(args: { key: string, form: boolean }): ReadonlyArray<string>
  select(properties: Array<string>, item?: Record<string, any>): Record<string, any>
}

interface MutationsAux {
  setItem(item: Item): Item
  setItems(items: Array<any>): Array<any>
  insertItem(item: Item, merge?: boolean): Item
  removeItem(item: Item): Item
  clearItem(): Item
  clearItems(): void
}

export type StatefulFunction<
  T extends (...args: any) => any,
  This=CollectionStore
> = (this: This & ActionsAux & MutationsAux, ...args: Parameters<T>) => ReturnType<T>

export type Actions = { [P in keyof ActionsAux]: StatefulFunction<ActionsAux[P]> }
export type Mutations = { [P in keyof MutationsAux]: StatefulFunction<MutationsAux[P]> }
