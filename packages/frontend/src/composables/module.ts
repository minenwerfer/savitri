import { computed } from 'vue'
import { fromEntries } from '../../../common'
import * as Entity from '../../../common/src/entity'

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

export const useModule = (name: string, store: any): any => {
  const description = () => store.state[name]?.__description||{}

  const self: any = {
    useFields: (fields: string[], except = false) => {
      return fromEntries(Object.entries(store.getters[`${name}/fields`])
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
      return Entity.getFirstValue(description(), value, key, form, name)
    },

    formatValue: (value: any, key: string, form: boolean = false, field?: any) => {
      return Entity.formatValue(description(), value, key, form, field)
    },

    resumeItem: (item: any) => {
      return Entity.resumeItem(description(), item)
    },

    getItemIndex: (item: any, items?: any[]) => {
      return Entity.getItemIndex(item, items, name)
    },

    setItem: (item: any) => {
      store.commit(`${name}/ITEM_GET`, { result: item })
    },

    ...(name ? {
      resumedItem: computed(() => self.resumeItem(store.getters[`${name}/item`])),
      resumedItems: computed(() => store.getters[`${name}/items`]?.map((i: any) => self.resumeItem(i))),

      ...getters.reduce((a, k: string) => ({ ...a, [k]: computed(() => store.getters[`${name}/${k}`]) }), {}),
      ...props.reduce((a, k: string) => ({ ...a, [k]: computed(() => store.state[name][k]) }), {}),
      ...actions.reduce((a, k: string) => ({ ...a, [k]: (payload: any) => store.dispatch(`${name}/${k}`, payload) }), {})
    }: {})
  }

    return self
}
