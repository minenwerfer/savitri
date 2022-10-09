import {
  COLLECTION_FIELD_TYPES,
  COLLECTION_PRESETS
} from '../constants'

export type CollectionFieldType = typeof COLLECTION_FIELD_TYPES[number]
export type CollectionPreset = typeof COLLECTION_PRESETS[number]

export type FormLayout = {
  span: number
  verticalSpacing: number
}

export type CollectionDescription = {
  collection: string
  alias?: string
  options?: {
    queryPreset?: {
      filters?: Record<string, any>
      sort?: Record<string, any>
    }
  }

  // modifiers
  strict?: boolean // all fields are required
  alwaysAttribute?: boolean
  route?: Array<string>|boolean

  // takes an array of something
  presets?: Array<CollectionPreset>
  table?: Array<string>
  form?: Array<string>
  writable?: Array<string>
  filters?: Array<string|{
    field: string
    default: string
  }>

  formLayout?: Record<string, Partial<FormLayout>>|object
  tableLayout?: Record<string, any>|object

  // actions
  actions?: CollectionActions
  individualActions?: CollectionActions

  searchable?: {
    indexes: Array<string>
    actions?: Record<string, CollectionAction>
  }

  fields: Record<string, CollectionField>
}

export type MaybeCollectionDescription = Omit<CollectionDescription, 'fields' | 'presets'> & {
  presets?: Array<string>
  fields?: Record<string, any>
}


export type CollectionField = Readonly<{
  label: string
  type?: CollectionFieldType
  collection?: string
  mask?: string

  inline?: boolean
  includeHours?: boolean
  readOnly?: boolean
  inlineEditing?: boolean

  /** @see SvFile */
  accept?: Array<string>

  values?: Record<string, string> | Record<number, any> | {
    __query: {
      collection: string
      index: Array<string>|string
      limit?: number
    }
  }
}>

export type CollectionAction = Readonly<{
  name: string
  unicon?: string
  ask?: boolean

  // route namespace
  fetchItem?: boolean
  clearItem?: boolean
}>

export type CollectionActions = Record<string, CollectionAction | null>
