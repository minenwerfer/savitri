import { COLLECTION_PRESETS, STORE_EFFECTS, } from '../constants'
import type { Property, PropertyUiFormats } from './jsonschema'

export type CollectionPresets = typeof COLLECTION_PRESETS[number]

export type StoreEffect = keyof typeof STORE_EFFECTS
export type CollectionId = string

export type CollectionAction = Readonly<{
  name: string
  unicon?: string
  ask?: boolean
  selection?: boolean
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
  $id: CollectionId
  alias?: string
  unicon?: string
  options?: {
    queryPreset?: {
      filters?: Record<string, any>
      sort?: Record<string, any>
    }
  }

  // modifiers
  strict?: boolean // all properties are required
  route?: Array<string>
  owned?: boolean

  // takes an array of something
  readonly presets?: Array<CollectionPresets>
  readonly required?: Array<string>
  table?: Array<string>
  tableMeta?: Array<string>

  form?: Array<string>
  writable?: Array<string>
  filters?: Array<string|{
    property: string
    default: string
  }>

  formLayout?: Record<string, Partial<FormLayout>>|object
  tableLayout?: Record<string, any>|object

  // actions
  actions?: CollectionActions
  individualActions?: CollectionActions

  searchable?: {
    picture?: string
    indexes: Array<string>
    actions?: Record<string, CollectionAction>
  }

  properties: Record<string, CollectionProperty>
}

export type MaybeCollectionDescription = Omit<CollectionDescription,
  '$id'
  | 'name'
  | 'properties'
  | 'required'
  | 'presets'
  | 'actions'
  | 'individualActions'
> & {
  $id: string
  name?: string
  required?: ReadonlyArray<string>
  presets?: Array<string>
  properties?: Record<string, any>
  actions?: MaybeCollectionActions
  individualActions?: MaybeCollectionActions
}

export type CollectionProperty = Property & {
  [P in keyof CollectionPropertyAux as `s$${P}`]: CollectionPropertyAux[P]
}

type CollectionPropertyAux = {
  icon?: string
  format?: PropertyUiFormats
  placeholder?: string
  hint?: string
  mask?: string
  translate?: boolean
  required?: boolean
  meta?: boolean
  form?: Array<string>

  noform?: boolean
  notable?: boolean
  unique?: boolean
  hidden?: boolean

  /** @see SvFile */
  readonly accept?: Array<string>

  isReference?: boolean
  referencedCollection?: string
  preventPopulate?: boolean
  noId?: boolean

  array?: boolean
  limit?: number
  index?: Array<string>|string
  select?: Array<string>
  maxDepth?: number
  inline?: boolean
  inlineEditing?: boolean
}
