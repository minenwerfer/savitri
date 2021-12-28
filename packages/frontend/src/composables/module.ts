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
  'individualActions'
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
  'remove',
  'clear'
]

export default (name: string, store: any) => {

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

    const reference: any = Object.entries(store.state[name].__description.fields||{})
      .find(([k]: [string, unknown]) => key === k)||[,]

    const query:any = {}

    // retrieves index if dynamic querying is used
    if( reference[1]?.values ) {

      // values can be either arrays or objects
      const prop = Array.isArray(reference[1].values)
        ? reference[1].values.find((e: any) => Object.keys(e)[0] === '__query')?.__query
        : reference[1].values.__query

      Object.assign(query, prop||{})
    }

    const { module, index, formIndex } = query.module ? query : (reference[1]||{})
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

    const source = query.module
      ? store.state[name]._queryCache[query.module].filter(({ _id }: any) => Array.isArray(value) ? value.includes(_id) : value._id === _id)
      : value

    const extract = (value: any) => typeof value === 'object' || firstField
      ? value[firstField]
      : value

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

  const resumedItem = (item: any) => {
    return Object.entries(item)
    .reduce((a: object, [key, value]: [string, any]) => ({
      ...a,
      [key]: typeof value === 'object'
        ? getFirstValue(value, key)
        : value
    }), {})
  }

  return {
    useFields,
    useFieldsExcept,
    getFirstField,
    getFirstValue,
    formatValue,
    resumedItem: computed(() => resumedItem(store.getters[`${name}/item`])),
    resumedItems: computed(() => store.getters[`${name}/items`].map((i: any) => resumedItem(i))),

    ...getters.reduce((a, k: string) => ({ ...a, [k]: computed(() => store.getters[`${name}/${k}`]) }), {}),
    ...props.reduce((a, k: string) => ({ ...a, [k]: computed(() => store.state[name][k]) }), {}),
    ...actions.reduce((a, k: string) => ({ ...a, [k]: (payload: any) => store.dispatch(`${name}/${k}`, payload) }), {})
  }
}
