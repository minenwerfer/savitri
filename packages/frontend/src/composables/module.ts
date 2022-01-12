import { computed } from 'vue'
import { fromEntries } from 'common/helpers'

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

export default (name: string, store: any): any => {

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
  const getFirstField = (value: any, key: string, form: boolean = false) => {

    const [_, reference]: any = Object.entries(store.state[name].__description.fields||{})
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

    const { module, index, formIndex } = query.module ? query : (reference||{})
    if( !module ) {
      return
    }

    return (form ? (formIndex || index) : index) || Object.keys(store.getters[`${module}/description`].fields)[0]
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

    const { values } = store.state[name]?.__description.fields[key]||{}
    const query = (Array.isArray(values)
      ? values[0]
      : values)?.__query||{}

    const firstField = getFirstField(value, key, form)

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

  const formatValue = (value: any, key: string, form: boolean = false) => {
    const firstValue = value && typeof value === 'object'
      ? getFirstValue(value, key, form)
      : value

    return firstValue !== undefined
      ? firstValue
      : '-'
  }

  const resumeItem = (item: any) => {
    return Object.entries(item)
    .reduce((a: object, [key, value]: [string, any]) => ({
      ...a,
      [key]: typeof value === 'object'
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
      .findIndex((i: any) => i._id === _id)
  }

  const setItem = (item: any) => {
    store.commit(`${name}/ITEM_GET`, { result: item })
  }

  return {
    useFields,
    useFieldsExcept,
    getFirstField,
    getFirstValue,
    formatValue,
    resumeItem,
    resumedItem: computed(() => resumeItem(store.getters[`${name}/item`])),
    resumedItems: computed(() => store.getters[`${name}/items`].map((i: any) => resumeItem(i))),
    getItemIndex,
    setItem,

    ...getters.reduce((a, k: string) => ({ ...a, [k]: computed(() => store.getters[`${name}/${k}`]) }), {}),
    ...props.reduce((a, k: string) => ({ ...a, [k]: computed(() => store.state[name][k]) }), {}),
    ...actions.reduce((a, k: string) => ({ ...a, [k]: (payload: any) => store.dispatch(`${name}/${k}`, payload) }), {})
  }
}
