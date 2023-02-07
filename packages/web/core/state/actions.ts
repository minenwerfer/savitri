import { getIndexes, formatValue } from '@semantic-api/common'
import { fromEntries, deepClone } from '@semantic-api/common'
import type { Description } from '@semantic-api/types'

import useHttp from '../http'
import useMetaStore from '../stores/meta'
import type { Actions, Mutations, Item } from './actions.types'
import { useStore } from './use'
import { condenseItem } from './helpers'

const { http, nonProxiedHttp } = useHttp()

const mutations: Mutations = {
  setItem(item) {
    Object.assign(this.item, deepClone(this.freshItem))
    Object.entries(item).forEach(([key, value]) => {
      this.item[key] = value
    })

    this.referenceItem = deepClone({
      ...this.freshItem,
      ...item
    })

    return item
  },

  setItems(items) {
    this.items = items
    return items
  },

  insertItem(_item, merge) {
    const old = merge
      ? Object.assign({}, this.item)
      : {}

    const item = Object.assign(old, _item)
    this.setItem(item)

    const found = this.items.find(({ _id }) => _id === item._id)
    if( found ) {
      Object.assign(found, item)
      return item
    }

    this.items = [
      item,
      ...this.items
    ]

    return item
  },

  removeItem(subject) {
    this.items = this.items.filter(({ _id }) => {
      if( Array.isArray(subject) ) {
        return !subject.find(sub => sub._id === _id)
      }

      return subject._id !== _id
    })
    if( this.item._id === subject._id ) {
      this.item._id = null
    }

    return subject
  },

  clearItem() {
    Object.keys(this.item).forEach((key) => {
      delete this.item[key]
    })

    return this.setItem({})
  },

  clearItems() {
    this.items = []
  },
}

const actionsAndMutations: Actions & Mutations = {
  ...mutations,

  $functions() {
    return new Proxy(this, {
      get: (target, verb: string) => {
        return async (...args: any[]) => {
          const result = await target.custom(verb, ...args)
          // if( result?._id ) {
          //   return this.insertItem(result, true)
          // }

          return result
        }
      }
    })
  },

  errorPopup(e) {
    if( !e.validation ) {
      return
    }

    const formattedErrors = Object.entries(e.validation)
      .map(([key, value]: [string, any]) => `- ${key}: ${value.type}`)
      .join('\n')

    const metaStore = useMetaStore()
    return metaStore.spawnModal({
      title: 'Erro',
      body: `There were some problems with your submission:\n${formattedErrors}`
    })
  },

  async custom(verb,  payload?, options?) {
    this.validationErrors = {}
    if( !options?.skipLoading ) {
      this.isLoading = true
    }

    const method = options?.method || 'POST'
    const route = verb
      ? `${this.$id}/${verb}`
      : this.$id

    const httpInstance = options?.unproxied
      ? nonProxiedHttp
      : http

    const promise = httpInstance[method.toLowerCase()](route, payload)
      .catch((err: any) => {
        if( err.validation ) {
          this.validationErrors = err.validation
        }

        throw err
      })
      .finally(() => {
        if( !options?.skipLoading ) {
          this.isLoading = false
        }
      })

    const data = (await promise)?.data
    if( options?.insert ) {
      this.insertItem(data)
    }

    return !options?.fullResponse
      ? data.result
      : data
  },

  async customEffect(verb, payload, fn, options?) {
    const response = await this.custom(verb, payload, options)
    if( options?.skipEffect ) {
      return response
    }

    return response
      ? fn(response)
      : {}
  },

  async $customEffect(verb, payload, fn, options?) {
    const response = await this.custom(verb, payload, {
      ...options,
      fullResponse: true
    })

    return fn(response)
  },

  async get(payload, options?) {
    return this.customEffect(
      'get', payload,
      this.setItem,
      options
    )
  },

  getAll(_payload)  {
    const payload = Object.assign({}, _payload)

    if( !payload.limit ) {
      payload.limit = this.pagination.limit
    }

    if( !payload.offset ) {
      payload.offset = this.pagination.offset
    }

    return this.$customEffect(
      'getAll', payload,
      ({ result, pagination }) => {
        this.$patch({
          items: result,
          pagination
        })

        return result
      }
    )
  },

  insert(payload?, options?) {
    return this.customEffect(
      null, { ...payload, what: payload?.what||this.item },
      this.insertItem,
      options
    )
  },

  async deepInsert(payload?) {
    const inlineReferences = this.inlineReferences
    const newItem = Object.assign({}, payload?.what || this.diffedItem) as Item

    for( const [k, { s$referencedCollection: collection, type }] of inlineReferences ) {
      if(
        newItem[k]
        && typeof newItem[k] === 'object'
        && Object.keys(newItem[k]).length > 0
      ) {
        const helperStore = useStore(collection!)

        const getInsertedId = async (subject: any) => {
          if( type === 'array' && Array.isArray(subject) ) {
            const ids = []
            for( const item of subject ) {
              const result = await helperStore.deepInsert({ what: item })
              ids.push(result._id)
            }

            return ids
          }

          const result = await helperStore.deepInsert({
            what: subject
          })

          return result?._id
        }

        newItem[k] = await getInsertedId(newItem[k])
      }
    }

    return this.insert({
      what: condenseItem(newItem)
    })
  },

  async delete(payload) {
    return this.customEffect(
      'delete', {
        filters: {
          _id: payload.filters?._id || payload._id
        }
      },
      this.removeItem
    )
  },

  async deleteAll(payload) {
    return this.customEffect(
      'deleteAll', {
        filters: {
          _id: payload.filters?._id || payload._id
        }
      },
      this.removeItem
    )
  },

  filter(props?) {
    this.activeFilters = props?.filters || this.$filters

    return this.getAll({
      filters: {
        ...this.activeFilters,
        ...this.filtersPreset
      },
      limit: this.pagination.limit,
      ...props||{}
    })
  },

  updateItems() {
    return this.filter()
  },

  clearFilters() {
    const filters = this.filters = deepClone(this.freshFilters)
    this.pagination.offset = 0
    this.filter()

    return filters
  },

  async ask(props) {
    const metaStore = useMetaStore()
    const answer = await metaStore.spawnPrompt({
      body: I18N.global.tc(props.body || 'prompt.default'),
      actions: [
        {
          name: 'cancel',
          title: I18N.global.tc('action.cancel'),
          variant: 'transparent',
          size: 'small'
        },
        {
          name: 'confirm',
          title: I18N.global.tc('action.confirm'),
        },
      ]
    })

    if( answer.name === 'confirm' ) {
      const { action, params } = props
      return action(params)
    }
  },

  useProperties(properties) {
    return properties.reduce((a, property) => {
      if( !(property in this.properties) ) {
        return a
      }

      return {
        ...a,
        [property]: this.properties[property]
      }

    }, {})
  },

  usePropertiesExcept(properties) {
    return fromEntries(Object.entries(this.properties)
      .filter(([key]: [string, unknown]) => !properties.includes(key)))
  },

  formatValue(args) {
    const value = args.property.s$translate
      ? I18N.global.tc(args.value||'')
      : args.value

    if( args.property?.s$isReference ) {
      const helperStore = this.store(args.property.s$referencedCollection!)
      const property = helperStore.description.properties![args.index!]

      if( property?.s$isReference ) {
        return helperStore.formatValue({
          property,
          key: args.key,
          index: args.index,
          value: Array.isArray(args.value)
            ? args.value.map((value) => value[args.index!])
            : (args.value as Record<string, any>)[args.index!]
        })
      }
    }

    return formatValue(
      value,
      args.key,
      args.property,
      args.index
    )
  },

  getIndexes(args) {
    return getIndexes(
      this.rawDescription as Pick<Description, 'properties'>,
      args.key
    )
  },

  select(properties, item) {
    return Object.entries(item || this.item).reduce((a, [key, value]) => {
      if( !properties.includes(key) ) {
        return a
      }

      return {
        ...a,
        [key]: value
      }
    }, {})
  }
}

export default actionsAndMutations
