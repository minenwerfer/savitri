export const COLLECTION_FIELD_TYPES = <const>[
  'boolean',
  'checkbox',
  'collection',
  'datetime',
  'integer',
  'number',
  'object',
  'password',
  'radio',
  'select',
  'text',
  'textbox',
]

export const COLLECTION_PRESETS = <const>[
  'alwaysOwned',
  'crud',
  'duplicate',
  'owned',
  'removeAll',
  'toggleActive',
  'view',
]

export type CollectionFieldType = typeof COLLECTION_FIELD_TYPES[number]
export type CollectionPreset = typeof COLLECTION_PRESETS[number]

export type CollectionField = Readonly<{
  label: string
  type?: CollectionFieldType
  collection?: string

  expand?: boolean
  includeHours?: boolean
  readOnly?: boolean

  values?: Array<string>|Record<string, string> & {
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
}>

export type CollectionActions = Record<string, CollectionAction>

export type CollectionDescription = Readonly<{
  collection: string

  // modifiers
  alwaysAttribute?: boolean
  route?: boolean

  // takes an array of something
  presets?: Array<CollectionPreset>
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
}>
