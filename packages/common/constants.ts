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

export const ARRAY_TYPES = <const>[
  'checkbox',
  'radio'
]

