import type { CollectionField } from '../../../common/types'
import type { CollectionState } from '../../types/store'
import { fromEntries, deepClone } from '../../../common'

import  {
  condenseItem,
  removeEmpty,
  normalizeFields,
  normalizeFilters,
  normalizeActions

} from './helpers'

export default {
  fields<T=any>(this: Pick<CollectionState<T>, 'description'>) {
    return normalizeFields(this.description.fields!)
  },

  /**
   * @see SvTable
   * @see SvCrud
   */
  tableDescription<T=any>(this: Pick<CollectionState<T>, 'description'>) {
    if( !this.description.fields ) {
      return
    }

    const prepare = (value: any) => ({
        ...value,
        label: value.name?.capitalize() || value.label,
        type: value.collection ? 'collection' : value.type,
    })

    const findField = (fieldName: string) =>
      Object.entries(this.description.fields||{}).find(([key]: [string, unknown]) => fieldName === key)

    if( this.description.table ) {
      return this.description.table
        .reduce((a:object, fieldName: string) => {
          const field = findField(fieldName)
          if( !field ) {
            return a
          }

          return {
            ...a,
            [fieldName]: prepare(field[1])
          }
        }, {})
    }

    return fromEntries(Object.entries(this.description.fields)
      .filter(([, value]: [unknown, any]) => !value.hidden && !value.notable)
      .slice(0, 8))
  },

  /**
   * @see SvCrud
   */
  actions<T=any>(this: Pick<CollectionState<T>, 'description'>) {
    return normalizeActions(this.description.actions!)
  },

  /**
   * @see SvCrud
   */
  individualActions<T=any>(this: Pick<CollectionState<T>, 'description'>) {
    return normalizeActions(this.description.individualActions!)
  },

  searchableActions<T=any>(this: Pick<CollectionState<T>, 'description'>) {
    return normalizeActions(this.description.searchable?.actions||{})
  },

  formLayout<T=any>(this: Pick<CollectionState<T>, 'description'>) {
    return this.description.formLayout||{}
  },

  tableLayout<T=any>(this: Pick<CollectionState<T>, 'description'>) {
    return this.description.tableLayout||{}
  },

  /**
   * Converts populated subdocuments back to ObjectIds.
   * @see SvCrud
   */
  condensedItem<T=any>(this: Pick<CollectionState<T>, 'item'>) {
    return condenseItem(this.item)
  },

  $item<T=any>(this: Pick<CollectionState<T>, 'item'>) {
    return this.item
  },

  /**
   * Normalizes state.items.
   */
  $items<T=any>(this: Pick<CollectionState<T>, 'items' | 'description'>) {
    if( !Array.isArray(this.items) ) return []

    const collections = Object.entries(this.description?.fields||{})
      .reduce((a: Array<any>, [key, field]: [string, CollectionField]) => {
        if( typeof field.collection !== 'string' ) {
          return a
        }

        return [
          ...a,
          key
        ]
      }, [])

    return this.items
      .map((item: any) => ({
        ...item,
        ...(fromEntries(collections.map((m) => [m, item[m]||{}])))
      }))
  },

  itemsCount<T=any>(this: Pick<CollectionState<T>, 'items'>) {
    return this.items.length
  },

  /**
   * Retrieves fields who refeer to a collection (typeof collection === 'string') and have "inline" set to true.
   * Used internally.
   */
  inlineReferences<T=any>(this: Pick<CollectionState<T>, 'description'>) {
    return Object.entries(this.description.fields||{})
      .filter(([, field]: [unknown, CollectionField]) => typeof field.collection === 'string' && field.inline === true)
  },

  /**
   * @see SvTable
   */
  selectedIds(this: Pick<CollectionState<{ _id: string }>, 'selected'>) {
    return this.selected.map((_) => _._id)
  },

  /**
   * @see SvCrud
   */
  $filters<T=any>(this: Pick<CollectionState<T>, 'filters' | 'description'>) {
    const filters = removeEmpty(deepClone(this.filters||{}))

    const expr = (key: string, value: any) => {
      const field = ((this.description).fields||{})[key]
      if( !field ) {
        return
      }

      if( field.type === 'text' ) {
        return {
          $regex: value,
          $options: 'i'
        }
      }

      const values = Array.isArray(field.values)
        ? field.values[0]
        : field.values

      if( (values as any)?.__query?.collection ) {
        return { _id: value }
      }

      return value
    }

    const entries = Object.entries(filters)
      .reduce((a: Array<any>, [key, filter]: [string, any]) => {
        if( filter && typeof filter === 'object' && !Array.isArray(filter) ) {
          Object.keys(filter).forEach((key) => {
            if( !filter[key] || Object.values(filter[key]).every((_) => !_) ) {
              delete filter[key]
            }
          })
        }

        if( !filter || Object.keys(filter).length === 0 ) {
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
  hasActiveFilters<T=any>(this: Pick<CollectionState<T>, 'filters'>) {
    return Object.values(this.filters)
      .some((value: any) => !!value)
  },

  availableFilters<T=any>(this: Pick<CollectionState<T>, 'description'> & { fields: Record<string, CollectionField> }) {
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

