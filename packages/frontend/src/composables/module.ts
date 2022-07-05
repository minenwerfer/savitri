import { computed } from 'vue'
import { fromEntries } from '../../../common'
import * as Entity from '../../../common/src/entity'

const getters = [
  'item',
  'condensedItem',
  'items',
  'actions',
  'fields',
  'filters',
  'availableFilters',
  'description',
  'tableDescription',
  'selectedIds',
  'individualActions',
  'queryCache',
  'limit'
]

const props = [
  'recordsCount',
  'recordsTotal',
  'isLoading',
  'selected',
  'currentPage'
]

const actions = [
  'get',
  'getAll',
  'insert',
  'deepInsert',
  'modify',
  'remove',
  'clear',
  'clearAll'
]

export const useModule = (moduleName: string, store: any): any => {
  const description = () => store.state[moduleName]?.__description||{}

  const self: any = {
    useFields: (fields: string[], except = false) => {
      return fromEntries(Object.entries(store.getters[`${moduleName}/fields`])
        .filter(([key]: [string, unknown]) => except ? !fields.includes(key) : fields.includes(key)))
    },

    useFieldsExcept: (fields: string[]) => {
      return self.useFields(fields, true)
    },

    getIndexes: (key: string, form: boolean = false) => {
      return Entity.getIndexes(description(), key, form)
    },

    getFirstIndex: (key: string, form: boolean = false) => {
      return Entity.getFirstIndex(description(), key, form)
    },

    getFirstValue: (value: any, key: string, form: boolean = false): any => {
      return Entity.getFirstValue(description(), value, key, form, moduleName)
    },

    formatValue: (value: any, key: string, form: boolean = false, field?: any) => {
      return Entity.formatValue(description(), value, key, form, field)
    },

    resumeItem: (item: any) => {
      return Entity.resumeItem(description(), item)
    },

    getItemIndex: (item: any, items?: any[]) => {
      return Entity.getItemIndex(item, items, moduleName)
    },

    setItem: (item: any) => {
      store.commit(`${moduleName}/ITEM_GET`, { result: item })
    },

    ...(moduleName ? {
      resumedItem: computed(() => self.resumeItem(store.getters[`${moduleName}/item`])),
      resumedItems: computed(() => store.getters[`${moduleName}/items`]?.map((i: any) => self.resumeItem(i))),

      ...getters.reduce((a, k: string) => ({ ...a, [k]: computed(() => store.getters[`${moduleName}/${k}`]) }), {}),
      ...props.reduce((a, k: string) => ({ ...a, [k]: computed(() => store.state[moduleName][k]) }), {}),
      ...actions.reduce((a, k: string) => ({ ...a, [k]: (payload: any) => store.dispatch(`${moduleName}/${k}`, payload) }), {})
    }: {})
  }

    return self
}
