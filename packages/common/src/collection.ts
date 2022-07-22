import { Store } from 'vuex'
import { Router } from 'vue-router'

import type { CollectionDescription, CollectionField } from '../types'

declare namespace globalThis {
  const _store: Store<any>
  const _router: Router
}

/**
 * @remarks web only (vuex)
 */
const _store = globalThis._store
const _router = globalThis._router

export const getIndexes = (description: any, key: string, form: boolean = false): any => {
  const [_, reference]: any = Object.entries(description.fields||{})
    .find(([k]: [string, unknown]) => key === k)||[,]

  const query:any = {}

  // retrieves index if dynamic querying is used
  if( reference?.values ) {

    // values can be either arrays or objects
    const prop = Array.isArray(reference.values)
      ? reference.values.find((e: any) => Object.keys(e)[0] === '__query')?.__query
      : reference.values.__query

    Object.assign(query, prop||{})
  }

  const {
    module,
    index,
    formIndex

  } = query.module ? query : (reference||{})

  if( !module ) {
    return
  }

  const field = (form ? (formIndex || index) : index) || Object.keys(description.fields)[0]
  return Array.isArray(field) ? field : [field]
}

export const getFirstIndex = (description: any, key: string, form: boolean = false) => {
  const fields = getIndexes(description, key, form)||[]
  return fields[0]
}

/**
 * @param {string} value
 * @param {string} key
 * @param {boolean} form - tells whether or not the value is being used in a form
 */
export const getFirstValue = (
  description: Pick<CollectionDescription, 'fields'>,
  value: any,
  key: string,
  form: boolean = false,
  name?: string
): string|number|null => {
  if( !value ) {
    return '-'
  }

  const { values } = description.fields[key]
  const query = (Array.isArray(values)
    ? values[0]
    : values as any)?.__query||{}

  const firstField = getFirstIndex(description, key, form)

  const source = _store && name && query.module && !(Array.isArray(value) ? value[0]?._id : value._id)
    ? _store.state[name]._queryCache[query.module].filter(({ _id }: any) => Array.isArray(value) ? value.includes(_id) : value._id === _id)
    : value

  const extract = (v: any) => typeof v === 'object' || firstField
    ? v[firstField]
    : v

  const firstValue = Array.isArray(source)
    ? source.map((v: any) => extract(v)).join(', ')
    : extract(source)

  return firstValue && typeof firstValue === 'object'
    ? getFirstValue(description, firstValue, firstField, form, name)
    : firstValue
}

export const formatValue = (
  description: Pick<CollectionDescription, 'fields'>,
  value: any,
  key: string,
  form: boolean = false,
  field?: CollectionField
): string => {
  const firstValue = value && typeof value === 'object' && !(value instanceof Date)
    ? ((Array.isArray(value) || value?._id) ? getFirstValue(description, value, key, form) : Object.values(value)[0])
    : value

  const formatted = (() => {
    switch(true) {
      case field?.type === 'datetime':
        return firstValue
          ? (String(firstValue) as any).formatDateTime(field?.includeHours)
          : '-'

      case field?.type === 'boolean': return firstValue ? 'sim' : 'não'
      case [undefined, null].includes(firstValue): return '-'
      default: return firstValue
    }
  })()

  return ![undefined, null].includes(formatted)
    ? String(formatted)
    : '-'
}

export const resumeItem = (description: any, item: any) => {
  return Object.entries(item||{})
  .reduce((a: object, [key, value]: [string, any]) => ({
    ...a,
    [key]: value && typeof value === 'object' && '_id' in value
      ? getFirstValue(description, value, key)
      : value
  }), {})
}

export const getItemIndex = (item: any, items?: Array<any>, name?: string) => {
  const _id = typeof item === 'object'
    ? item._id
    : item

  return ((items||_store?.getters[`${name}/items`])||[])
    .sort((a: any, b: any) => a._id > b._id ? -1 : 1)
    .findIndex((i: any) => i._id === _id) + 1
}

export const action = (moduleName: string, store: any, router: any) =>
  async (action: string, actionProps: any, filters: any) => {
  if( action.split('/')[0] === 'route' ) {
    await store.dispatch(`${moduleName}/get`, { filters: { _id: filters._id } })
    return router.push({ name: action.split('/')[1], params: { id: filters._id } })
  }

  return actionProps.ask
    ? store.dispatch(`${moduleName}/ask`, { action, params: { payload: { filters }}})
    : store.dispatch(`${moduleName}/${action}`, { payload: { filters  }})
}
