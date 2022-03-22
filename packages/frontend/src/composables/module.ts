import { computed } from 'vue'
import { fromEntries } from 'common/helpers'
import { getIndexes } from 'common/entity'

const getters = [
  'item',
  'condensedItem',
  'items',
  'fields',
  'filters',
  'availableFilters',
  'description',
  'tableDescription',
  'selectedIds',
  'individualActions',
  'queryCache'
]

const props = [
  'recordsCount',
  'recordsTotal',
  'isLoading',
  'selected'
]

const actions = [
  'get',
  'getAll',
  'insert',
  'deepInsert',
  'modify',
  'remove',
  'clear'
]

export const useModule = (name: string, store: any): any => {

  const useFields = (fields: string[], except = false) => {
    return fromEntries(Object.entries(store.getters[`${name}/fields`])
      .filter(([key]: [string, unknown]) => except ? !fields.includes(key) : fields.includes(key)))
  }

  const useFieldsExcept = (fields: string[]) => useFields(fields, true)

  /**
   * @param {string} value
   * @param {string} key
   * @param {boolean} form - tells whether or not the value is being used in a form
   */
  const _getIndexes = (key: string, form: boolean = false) => {
    return getIndexes(store.state[name].__description, key, form)
  }

  const getFirstIndex = (key: string, form: boolean = false) => {
    const fields = _getIndexes(key, form)
    return (fields||[])[0]
  }

  /**
   * @param {string} value
   * @param {string} key
   * @param {boolean} form - tells whether or not the value is being used in a form
   */
  const getFirstValue = (value: any, key: string, form: boolean = false): any => {

    if( !value ) {
      return '-'
    }

    const { values } = (store.state[name]?.__description.fields||{})[key]||{}
    const query = (Array.isArray(values)
      ? values[0]
      : values)?.__query||{}

    const firstField = getFirstIndex(key, form)

    const source = query.module && !(Array.isArray(value) ? value[0]?._id : value._id)
      ? store.state[name]._queryCache[query.module].filter(({ _id }: any) => Array.isArray(value) ? value.includes(_id) : value._id === _id)
      : value

    const extract = (v: any) => typeof v === 'object' || firstField
      ? v[firstField]
      : v

    const firstValue = Array.isArray(source)
      ? source.map((v: any) => extract(v)).join(', ')
      : extract(source)

    return firstValue && typeof firstValue === 'object'
      ? getFirstValue(firstValue, firstField)
      : firstValue
  }

  const formatValue = (value: any, key: string, form: boolean = false, field: any) => {
    const firstValue = value && typeof value === 'object'
      ? ((Array.isArray(value) || value?._id) ? getFirstValue(value, key, form) : Object.values(value)[0])
      : value

    const formatted = firstValue !== undefined
      ? ( field?.type === 'datetime' ? firstValue?.formatDateTime(field.includeHours) : firstValue )
      : '-'

    return !form && typeof formatted === 'string' && formatted.length >= field?.trim && field && field.trim
      ? formatted.substr(0, field.trim - 3) + '...'
      : formatted
  }

  const resumeItem = (item: any) => {
    return Object.entries(item||{})
    .reduce((a: object, [key, value]: [string, any]) => ({
      ...a,
      [key]: value && typeof value === 'object' && '_id' in value
        ? getFirstValue(value, key)
        : value
    }), {})
  }

  const getItemIndex = (item: any, items?: any[]) => {
    const _id = typeof item === 'object'
      ? item._id
      : item

    return (items||store.getters[`${name}/items`])
      .sort((a: any, b: any) => a._id > b._id ? -1 : 1)
      .findIndex((i: any) => i._id === _id) + 1
  }

  const setItem = (item: any) => {
    store.commit(`${name}/ITEM_GET`, { result: item })
  }

  return {
    useFields,
    useFieldsExcept,
    getIndexes: _getIndexes,
    getFirstIndex,
    getFirstValue,
    formatValue,
    resumeItem,
    resumedItem: computed(() => resumeItem(store.getters[`${name}/item`])),
    resumedItems: computed(() => store.getters[`${name}/items`]?.map((i: any) => resumeItem(i))),
    getItemIndex,
    setItem,

    ...getters.reduce((a, k: string) => ({
      ...a,
      [k]: computed(() => store.getters[`${name}/${k}`])
    }), {}),

    ...props.reduce((a, k: string) => ({
      ...a,
      [k]: computed(() => store.state[name][k])
    }), {}),

    ...actions.reduce((a, k: string) => ({
      ...a, [k]: (payload: any) => store.dispatch(`${name}/${k}`, payload)
    }), {})
  }
}
