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
  | 'collection'
  | 'datetime'
  | 'boolean'

export type CollectionField = {
  label: string
  type: CollectionFieldType
  collection?: string

  expand?: boolean
  includeHours?: boolean

  values?: Array<string>|Record<string, string> & {
    __query: {
      collection: string
      index: Array<string>|string
      limit?: number
    }
  }
}

export type CollectionAction = {
  name: string
  unicon?: string
  ask?: boolean
}

export type CollectionActions = Record<string, CollectionAction>

export type CollectionDescription = {
  collection: string

  // modifiers
  alwaysAttribute?: boolean
  route?: boolean

  // takes an array of something
  preset?: Array<CollectionPreset>
  table?: Array<string>
  filters?: Array<string>

  // actions
  actions?: CollectionActions
  individualActions?: CollectionActions

  searchable?: {
    indexes: Array<string>
    actions: Record<string, CollectionAction>
  }


  fields: Record<string, CollectionField>
}
