import type { CollectionProperty, Layout, LayoutName } from '@semantic-api/types'
import type { CollectionStore, CollectionState } from '..//types/state'
import { deepClone, deepMerge } from '@semantic-api/common'
import { deepDiff } from './helpers'
import { useStore } from './use'

import  {
  condenseItem,
  isNull,
  removeEmpty,
  normalizeFilters,
  normalizeActions

} from './helpers'

export type Getters = Record<`$${string}`, any> & {
  $patch: any
  properties: Record<string, CollectionProperty>
  references: Array<[string, CollectionProperty]>
  inlineReferences: Array<[string, CollectionProperty]>
  diffedItem: Record<string, any>
  hasDiff: boolean
}

type GettersFunctions = Record<string, (this: Getters & CollectionStore) => any>

const getters: GettersFunctions = {
  description() {
    if( this._description.preferred ) {
      const userStore = useStore('user')
      const description = Object.assign({}, this._description)
      const toMerge = {}

      userStore.$currentUser.roles.forEach((role: string) => {
        if( role in this._description.preferred! ) {
          deepMerge(toMerge, this._description.preferred![role])
        }
      })

      deepMerge(description, toMerge, { arrays: false })
      return description
    }

    return this._description
  },

  properties() {
    return this.description.properties
  },

  actions() {
    return normalizeActions(this.description.actions!)
  },

  individualActions() {
    return normalizeActions(this.description.individualActions!)
  },

  hasSelectionActions(this: any) {
    return this.actions
      .some((action: any) => !!action.selection)
  },

  formLayout() {
    return this.description.formLayout||{}
  },

  tableProperties() {
    const properties = this.preferredTableProperties.length > 0
      ? this.preferredTableProperties
      : this.description.table

    return properties
      ? this.useProperties(properties)
      : this.properties
  },

  tableMeta() {
    return this.description.tableMeta||[]
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

  diffedItem() {
    return deepDiff(
      this.referenceItem,
      this.item,
      true
    )
  },

  hasDiff() {
    return Object.keys(this.diffedItem).length
  },

  insertReady() {
    const formIncludes = (key: string) => {
      const form = this.description.form!
      return Array.isArray(form)
        ? form.includes(key)
        : key in form
    }

    const ensureFulfillment = () => {
      const keys = this.description.strict
        ? Object.keys(this.properties)
        : this.description.required

      if( !keys ) {
        return true
      }

      return keys.every((k) => {
        const property = this.description.properties?.[k]!
        if( property.s$meta ) {
          return true
        }

        return !(k in this.properties)
          || (this.description.form && !formIncludes(k))
          || property.type === 'boolean'
          || (
            !!this.item[k]
              && (
                !property.s$isReference
                || property.type === 'array'
                || this.item[k]._id
              )
          )
      })
    }
    
    return this.hasDiff
      && ensureFulfillment()
  },

  $freshItem() {
    const recurse = (
      store: CollectionState<any> & Getters,
      parent?: string,
      grandParent?: string
    ): Record<string, any> => {
      return Object.entries(store.properties).reduce((a, [key, property]) => {
        if(
          property.s$isReference
            && property.s$inline
            && property.type !== 'array'
            && store.$id !== grandParent
        ) {
          const subject = property.s$referencedCollection!
          const helperStore = useStore(subject)

          return {
            ...a,
            [key]: recurse(helperStore, store.$id, parent)
          }
        }

        return {
          ...a,
          [key]: store.freshItem[key]
        }
      }, {})
    }

    return recurse(this)
  },
  
  $freshFilters() {
    return deepClone(this.freshFilters)
  },

  itemsCount() {
    return this.items.length
  },

  references() {
    return Object.entries(this.description.properties||{}).filter(([, property]) => {
      return property.s$isReference
    })
  },

  inlineReferences() {
    return Object.entries(this.description.properties||{}).filter(([, property]) => {
      return property.s$isReference && property.s$inline
    })
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
      const getValue = (value: any) => {
        if( !property ) {
          return value
        }

        if( property.type === 'boolean' && value === false ) {
          return {
            $ne: true
          }
        }

        if( property.type === 'string' && !property.format ) {
          return {
            $regex: value,
            $options: 'i'
          }
        }

        return value?._id||value
      }

      if( Array.isArray(value) ) {
        return {
          $in: value.map(v => getValue(v))
        }
      }

      return getValue(value)
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
          if( isNull(filter[key]) || Object.values(filter[key]).every((_) => isNull(_)) ) {
            delete filter[key]
          }
        })
      }

      if( isNull(filter) || (typeof filter === 'object' && Object.keys(filter).length === 0) ) {
        return a
      }

      return [
        ...a,
        [key, expr(key, filter)]
      ]
    }, [])


    return Object.fromEntries(entries)
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

    return Object.keys(normalizeFilters(this.description.filters)).reduce((a, k) => {
      const property = this.properties[k]

      return {
        ...a,
        ...(property ? { [k]: property } : {})
      }
    }, {})
  },
  
  layout() {
    return this.description.layout || {
      name: 'tabular',
      options: {}
    } as Layout
  },

  $currentLayout() {
    return this.currentLayout || (this.description.layout?.name||'tabular') as LayoutName
  },
  
  customGetter() {
    this.customGetters;

    return new Proxy(this, {
      get: (_, functionName: string) => (keySuffix: string, ...args: any[]) => {
        const key = `${functionName}_${keySuffix}`
        if( !this.customGetters[key] ) {
          this[functionName](...args).then((result: any) => {
            this.customGetters[key] = result
          })
        }

        return this.customGetters[key]
      }
    })
  },

  transformers() {
    return {}
  }
}

export default getters
