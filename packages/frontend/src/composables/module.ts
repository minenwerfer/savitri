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

export default (name: string, store: any) => {

  const useFields = (fields: string[], except = false) => {
    return fromEntries(Object.entries(store.getters[`${name}/fields`])
      .filter(([key]: [string, unknown]) => except ? !fields.includes(key) : fields.includes(key)))
  }

  const useFieldsExcept = (fields: string[]) => useFields(fields, true)

  const getFirstField = (value: any, key: string, form: boolean = false) => {
    const reference: any = Object.entries(store.getters[`${name}/fields`]||{})
      .find(([k]: [string, unknown]) => key === k)||[,]

    const { module, index, formIndex } = reference[1]||{}
    if( !module ) {
      return
    }

    return (form ? (formIndex || index) : index) || Object.keys(store.getters[`${module}/description`].fields)[0]
  }

  const getFirstValue = (value: any, key: string, form: boolean = false): any => {
    if( !value ) {
      return '-'
    }

    const firstField = getFirstField(value, key, form)
    const firstValue = Array.isArray(value)
      ? value.map((v: any) => v[firstField]).join(', ')
      : value[firstField]

    return firstValue && typeof firstValue === 'object'
      ? getFirstValue(firstValue, firstField)
      : firstValue
  }

  const formatValue = (value: any, key: string, form: boolean = false) => {
    const firstValue = value && typeof value === 'object'
      ? getFirstValue(value, key, form)
      : value

    return firstValue || '-'
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

  const insert = (payload: any) => store.dispatch(`${name}/insert`, payload)
  const deepInsert = (payload: any) => store.dispatch(`${name}/deepInsert`, payload)

  return {
    insert,
    deepInsert,

    useFields,
    useFieldsExcept,
    getFirstField,
    getFirstValue,
    formatValue,
    resumedItem: computed(() => resumedItem(store.getters[`${name}/item`])),
    resumedItems: computed(() => store.getters[`${name}/items`].map((i: any) => resumedItem(i))),

    ...getters.reduce((a, k: string) => ({ ...a, [k]: computed(() => store.getters[`${name}/${k}`]) }), {}),
    ...props.reduce((a, k: string) => ({ ...a, [k]: computed(() => store.state[name][k]) }), {})
  }
}
