import type { CollectionField } from '../../../common/types'
import type { CollectionState } from '../../types/state'
import { fromEntries, deepClone } from '../../../common'

import  {
  condenseItem,
  removeEmpty,
  normalizeFields,
  normalizeFilters,
  normalizeActions

} from './helpers'

type Getters = Record<string, (this: CollectionState<any> & Record<`$${string}`, any> & {
  fields: Record<string, CollectionField>
}) => any>

const getters: Getters = {
  fields() {
    return normalizeFields(this.description.fields!)
  },

  /**
   * @see SvTable
   * @see SvCrud
   */
  tableDescription() {
    if( !this.description.fields ) {
      return
    }

    const prepare = (field: any) => ({
      ...field,
      label: field.name?.capitalize() || field.label,
      type: field.collection ? 'collection' : field.type,
    })

    if( this.description.table ) {
      return this.description.table.reduce((a:object, fieldName) => {
        const field = this.description.fields?.[fieldName]
        if( !field ) {
          return a
        }

        return {
          ...a,
          [fieldName]: prepare(field)
        }
      }, {})
    }

    return fromEntries(Object.entries(this.description.fields)
      .filter(([, field]: [unknown, any]) => !field.hidden && !field.notable)
      .slice(0, 8))
  },

  tableMeta() {
    return this.description.tableMeta||[]
  },

  /**
   * @see SvCrud
   */
  actions() {
    return normalizeActions(this.description.actions!)
  },

  /**
   * @see SvCrud
   */
  individualActions() {
    return normalizeActions(this.description.individualActions!)
  },

  searchableActions() {
    return normalizeActions(this.description.searchable?.actions||{})
  },

  formLayout() {
    return this.description.formLayout||{}
  },

  tableLayout() {
    return this.description.tableLayout||{}
  },

  /**
   * Converts populated subdocuments back to ObjectIds.
   * @see SvCrud
   */
  condensedItem() {
    return condenseItem(this.item)
  },

  $item() {
    return this.item
  },

  /**
   * Normalizes state.items.
   */
  $items() {
    if( !Array.isArray(this.items) ) return []

    const collections = Object.entries(this.description?.fields||{})
      .reduce((a: Array<any>, [key, field]) => {
        if( typeof field.collection !== 'string' ) {
          return a
        }

        return [
          ...a,
          key
        ]
      }, [])

    return this.items.map((item: any) => ({
      ...item,
      ...(fromEntries(collections.map((m) => [m, item[m]||{}])))
    }))
  },

  itemsCount() {
    return this.items.length
  },

  /**
   * Retrieves fields which refeer to a collection (typeof collection === 'string') and have "inline" set to true.
   * Used internally.
   */
  inlineReferences() {
    return Object.entries(this.description.fields||{})
      .filter(([, field]) => typeof field.collection === 'string' && field.inline === true)
  },

  /**
   * @see SvTable
   */
  selectedIds() {
    return this.selected.map((_) => _._id)
  },

  /**
   * @see SvCrud
   */
  $filters() {
    const filters = removeEmpty(deepClone(this.filters||{}))

    const expr = (key: string, value: any) => {
      const field = this.description.fields?.[key]
      if( !field ) {
        return
      }

      if( field.type === 'text' ) {
        return {
          $regex: value,
          $options: 'i'
        }
      }

      return value._id || value
    }

    const entries = Object.entries(filters).reduce((a: Array<any>, [key, filter]: [string, any]) => {
      if( key.startsWith('$') ) {
        return [
          ...a,
          [key, filter]
        ]
      }

      if( filter && typeof filter === 'object' && !Array.isArray(filter) ) {
        Object.keys(filter).forEach((key) => {
          if( !filter[key] || Object.values(filter[key]).every((_) => !_) ) {
            delete filter[key]
          }
        })
      }

      if( !filter || (typeof filter === 'object' && Object.keys(filter).length === 0) ) {
        return a
      }

      return [
        ...a,
        [key, expr(key, filter)]
      ]
    }, [])


    return condenseItem(fromEntries(entries))
  },

  /**
   * @see SvCrud
   */
  filtersCount() {
    return Object.values(this.$filters)
      .filter((_) => !!_)
      .length
  },

  /**
   * @see SvCrud
   */
  hasActiveFilters() {
    return Object.values(this.filters)
      .some((value) => !!value)
  },

  availableFilters() {
    if( !this.description?.filters || !this.description?.fields ) {
      return {}
    }

    return Object.keys(normalizeFilters(this.description.filters))
      .reduce((a: object, k: string) => {
        const field = this.fields[k]

        return {
          ...a,
          ...(field ? { [k]: field } : {})
        }
      }, {})
  }
}

export default getters
