import { CollectionDescription } from '../../common/types/collection'

export type PiniaState = {
  $id?: string
}

export type CollectionState<Item> = PiniaState & {
  item: Item|object
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

  pagination: {
    limit: number
    recordsCount: number
    recordsTotal: number
    currentPage: number
  }
}

export type CollectionStoreActions = {
  setItem<T=any>(
    this: Pick<CollectionState<T>, 'item'>,
    item: T
  ): void

  setItems<T=any>(
    this: Pick<CollectionState<T>, 'items'>,
    items: Array<T>
  ): void

  clearItem<T=any>(
    this: Pick<CollectionState<T>, 'item'>
  ): void

  clearItems<T=any>(
    this: Pick<CollectionState<T>, 'items'>
  ): void

  customEffect(
    verb: string,
    payload: any,
    fn: (state: any, result: any) => any
  ): any|void
}
