export type CollectionPreset =
  'crud'
  | 'duplicate'
  | 'owned'
  | 'alwaysOwned'
  | 'removeAll'
  | 'toggleActive'
  | 'view'

export type CollectionFieldType =
  'text' 
  | 'number'
  | 'module'

export type CollectionField = {
    label: string
    type: CollectionFieldType
}

export type CollectionDescription = {
  module: string
  route: boolean
  preset: Array<CollectionPreset>
  table: Array<string>
  filters: Array<string>
  alwaysAttribute: boolean
  fields: Record<string, CollectionField>
}

export type PiniaState = {
  $id?: string
}

export type CollectionState<Item> = PiniaState & {
  item: Item|object
  items: Array<Item>
  filters: Partial<Item>

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

export type CollectionActions = {
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

