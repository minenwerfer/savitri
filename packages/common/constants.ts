export const SV_API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api'
  : '/api'

// const SV_API_URL_2 = process.env.NODE_ENV === 'development'
//   ? 'http://localhost:3001/api'
//   : '/api2'

// for preventing resource exhaustion
export const PAGINATION_PER_PAGE_LIMIT = 150

// used in frontend pagination widget
export const PAGINATION_PER_PAGE_DEFAULTS = [
  10,
  35,
  100,
  150
]

// default value of above
export const PAGINATION_PER_PAGE_DEFAULT = 35

export const COLLECTION_FIELD_TYPES = <const>[
  'boolean',
  'checkbox',
  'datetime',
  'email',
  'integer',
  'number',
  'object',
  'password',
  'radio',
  'reference',
  'select',
  'text',
  'textbox',
]

export const COLLECTION_PRESETS = <const>[
  'crud',
  'duplicate',
  'delete',
  'deleteAll',
  'owned',
  'toggleActive',
  'view',
]

export const ARRAY_TYPES = <const>[
  'checkbox',
  'radio'
]

export const STORE_EFFECTS = {
  'ITEM_SET': 'setItem',
  'ITEM_INSERT': 'insertItem',
  'ITEMS_SET': 'setItems',
  'ITEMS_UPDATE': 'updateItems',
}

