import {
  COLLECTION_FIELD_TYPES,
  COLLECTION_PRESETS,
  STORE_EFFECTS

} from '../constants'

export type CollectionFieldType = typeof COLLECTION_FIELD_TYPES[number]
export type CollectionPreset = typeof COLLECTION_PRESETS[number]

export type StoreEffect = keyof typeof STORE_EFFECTS

export type CollectionAction = Readonly<{
  name: string
  unicon?: string
  ask?: boolean
  effect?: StoreEffect

  // route namespace
  fetchItem?: boolean
  clearItem?: boolean
}>

export type CollectionActions = Record<string, null|CollectionAction>
export type MaybeCollectionAction = Omit<CollectionAction, 'effect'> & { effect?: string }
export type MaybeCollectionActions = Record<string, null|MaybeCollectionAction>

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
  route?: Array<string>|boolean

  // takes an array of something
  presets?: Array<CollectionPreset>
  table?: Array<string>
  tableMeta?: Array<string>

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

export type MaybeCollectionDescription = Omit<CollectionDescription,
  'fields'
  | 'presets'
  | 'actions'
  | 'individualActions'
> & {
  presets?: Array<string>
  fields?: Record<string, any>
  actions?: MaybeCollectionActions
  individualActions?: MaybeCollectionActions
}

export type CollectionReference = {
  collection: string
  array?: boolean
  limit?: number
  index?: Array<string>|string
  select?: Array<string>
  maxDepth?: number
  inline?: boolean
  inlineEditing?: boolean
}

export type CollectionField = Readonly<CollectionReference & {
  label: string
  type?: CollectionFieldType
  isReference?: boolean
  dynamicReference?: boolean
  referencedCollection?: string
  mask?: string
  translate?: boolean

  includeHours?: boolean
  readOnly?: boolean
  uniqueValues?: boolean

  /** @see SvFile */
  accept?: Array<string>

  values?: Record<string, string> | Record<number, any> | {
    __query: CollectionReference
  }
}>
