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
  alwaysAttribute: boolean
  fields: Record<string, CollectionField>
}

export type CollectionState<Item> = {
  item: Item|object
  items: Array<Item>
  filters: Partial<Item>
  queryCache: Record<string, any>
  description: Readonly<Partial<CollectionDescription>>

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

