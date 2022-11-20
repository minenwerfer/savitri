import type { CollectionProperty } from '../../../types'
import type { CollectionState } from '../../types/state'
import { fromEntries, deepClone } from '../../../common'

import  {
  condenseItem,
  removeEmpty,
  normalizeProperties,
  normalizeFilters,
  normalizeActions

} from './helpers'

type Getters = Record<string, (this: CollectionState<any> & Record<`$${string}`, any> & {
  properties: Record<string, CollectionProperty>
}) => any>

const getters: Getters = {
  properties() {
    return normalizeProperties(this.description.properties!)
  },

  /**
   * @see SvTable
   * @see SvCrud
   */
  tableDescription() {
    if( !this.description.properties ) {
      return
    }

    const prepare = (property: any) => ({
      ...property,
      label: property.name?.capitalize() || property.label,
      type: property.$ref ? 'collection' : property.type,
    })

    if( this.description.table ) {
      return this.description.table.reduce((a:object, propertyName) => {
        const property = this.description.properties?.[propertyName]
        if( !property ) {
          return a
        }

        return {
          ...a,
          [propertyName]: prepare(property)
        }
      }, {})
    }

    return fromEntries(Object.entries(this.description.properties)
      .filter(([, property]: [unknown, any]) => !property.hidden && !property.notable)
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

    const collections = Object.entries(this.description?.properties||{})
      .reduce((a: Array<any>, [key, property]) => {
        if( typeof property.$ref !== 'string' ) {
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
   * Retrieves properties which refeer to a collection (typeof collection === 'string') and have "inline" set to true.
   * Used internally.
   */
  inlineReferences() {
    return Object.entries(this.description.properties||{})
      .filter(([, property]) => typeof property.$ref === 'string' && property.s$inline)
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
      const property = this.description.properties?.[key]
      if( !property ) {
        return
      }

      if( property.type === 'string' ) {
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
    if( !this.description?.filters || !this.description?.properties ) {
      return {}
    }

    return Object.keys(normalizeFilters(this.description.filters))
      .reduce((a: object, k: string) => {
        const property = this.properties[k]

        return {
          ...a,
          ...(property ? { [k]: property } : {})
        }
      }, {})
  }
}

export default getters
