import * as Collection from '../../../common/collection'
import { fromEntries, deepClone } from '../../../common'
import type { CollectionDescription } from '../../../types'

import useHttp from '../http'
import useMetaStore from '../stores/meta'
import { useStore } from './use'
import type { Actions, Mutations, Item } from './actions.types'

const { http, nonProxiedHttp } = useHttp()

const mutations: Mutations = {
  setItem(item) {
    this.item = item
    return item
  },

  setItems(items) {
    this.items = items
    return items
  },

  insertItem(item) {
    this.item = item
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

  removeItem(item) {
    this.items = this.items.filter(({ _id }) => item._id !== _id)
    if( this.item._id === item._id ) {
      this.item._id = null
    }

    return item
  },

  clearItem() {
    const item = this.item = deepClone(this.freshItem)
    return item
  },

  clearItems() {
    this.items = []
  },
}

const actionsAndMutations: Actions & Mutations = {
  ...mutations,

  $controller() {
    return new Proxy(this, {
      get: (target, verb: string) => {
        return (...args: any[]) => target.custom(verb, ...args)
      }
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
    return !options?.fullResponse
      ? data.result
      : data
  },

  async customEffect(verb, payload, fn, options?) {
    const response = await this.custom(verb, payload, options)
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
    const newItem = (payload?.what || this.item) as Item

    for( const [k, { $ref: collection, type }] of inlineReferences ) {
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
              const result = await helperStore.insert({ what: item })
              ids.push(result._id)
            }

            return ids
          }

          return helperStore.insert({
            what: subject
          })?._id
        }

        newItem[k] = await getInsertedId(newItem[k])
      }
    }

    return this.insert({
      what: newItem
    })
  },

  delete(payload) {
    return this.customEffect(
      'delete', { filters: { _id: payload?.filters?._id } },
      this.removeItem
    )
  },

  filter(props?) {
    this.activeFilters = this.$filters

    return this.getAll({
      filters: this.$filters,
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
          title: I18N.global.tc('cancel'),
          variant: 'transparent'
        },
        {
          name: 'confirm',
          title: I18N.global.tc('confirm'),
          size: 'large'
        },
      ]
    })

    if( answer.name === 'confirm' ) {
      const { action, params } = props
      return action(params)
    }
  },

  useProperties(properties) {
    return properties.reduce((a: any, property) => {
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

      return Collection.formatValue(
        this.rawDescription as Pick<CollectionDescription, 'properties'>,
        value,
        args.key,
        args.property
      )
  },

  getIndexes(args) {
    return Collection.getIndexes(
      this.rawDescription as Pick<CollectionDescription, 'properties'>,
      args.key
    )
  }
}

export default actionsAndMutations
