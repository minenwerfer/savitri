import type { CollectionField } from '../../../common/types'
import type { CollectionState } from '../../types/store'
import { fromEntries } from '../../../common'

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

    if( !!this.description.table ) {
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

  /**
   * Converts populated subdocuments back to ObjectIds.
   * @see SvCrud
   */
  condensedItem<T=any>(this: Pick<CollectionState<T>, 'item'>) {
    return condenseItem(this.item)
  },

  $item<T=any>(this: Pick<CollectionState<T>, 'item'>) {
    //
  },

  /**
   * Normalizes state.items.
   */
  $items<T=any>(this: Pick<CollectionState<T>, 'items' | 'description'>) {
    if( !Array.isArray(this.items) ) return []

    const collections = Object.entries(this.description?.fields||{})
      .filter(([, value]: [unknown, CollectionField]) => typeof value.collection === 'string')
      .map(([key, ]) => key)

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
   * Retrieves fields who refeer to a collection (typeof collection === 'string') and have "expanded" set to true.
   * Used internally.
   */
  expandedSubcollections<T=any>(this: Pick<CollectionState<T>, 'description'>) {
    return Object.entries(this.description.fields||{})
      .filter(([, value]: [unknown, CollectionField]) => typeof value.collection === 'string' && value.expand === true)
  },

  /**
   * @see SvTable
   */
  selectedIds(this: Pick<CollectionState<{ _id: string }>, 'selected'>) {
    return this.selected.map((s) => s._id)
  },

  /**
   * @see SvCrud
   */
  $filters<T=any>(this: Pick<CollectionState<T>, 'filters' | 'description'>) {
    const filters = removeEmpty(this.filters||{})

    const expr = (key: string, value: any) => {
      const field = ((this.description).fields||{})[key]

      // TODO: debug this
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
      .filter(([_, value]: [unknown, any]) => value && !(typeof value === 'string' &&  value.length === 0))
      .map(([key, value]) => [key, expr(key, value)])


    return condenseItem(fromEntries(entries))
  },

  /**
   * @see SvCrud
   */
  filtersCount<T=any>(this: Pick<CollectionState<T>, 'filters'>) {
    return Object.values(this.filters)
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

  availableFilters<T=any>(this: { fields(state: CollectionState<T>): T } & Pick<CollectionState<T>, 'description'>) {
    if( !this.description?.filters ) {
      return {}
    }

    return Object.keys(normalizeFilters(this.description.filters))
      .reduce((a: object, k: string) => {
        const field = Object.entries(this.fields)
          .find(([key]: [string, unknown]) => key === k)

        return {
          ...a,
          ...(field ? { [k]: field[1] } : {})
        }
      }, {})
  }
}

