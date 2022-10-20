import * as Collection from '../../../common/collection'
import { fromEntries, deepClone } from '../../../common'
import type { CollectionDescription, CollectionField } from '../../../common/types'
import type {
  CollectionState,
  CollectionGetters,
  PiniaState,
  Pagination

} from '../../types/store'

import useHttp from '../http'
import useMetaStore from './stores/meta'
import { useStore } from './use'

type CollectionStateItem<T> =
  Pick<CollectionState<T>, 'item'>

type CollectionStateItems<T> =
  Pick<CollectionState<T>, 'items'>

type CrudParameters = {
  filters: any
  limit: number
  offset: number
}

type ActionOptions = {
  method?:
    'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
  skipLoading?: boolean
}

type ActionFilter = Partial<Pick<CrudParameters,
  'filters'
  | 'limit'
  | 'offset'>
>

const { http } = useHttp()

const mutations = {
  setItem<T>(
    this: CollectionStateItem<T>,
    item: T
  ) {
    this.item = item
    return item
  },

  setItems<T>(
    this: CollectionStateItems<T>,
    items: Array<T>
  ) {
    this.items = items
    return items
  },

  insertItem<T extends { _id: string }>(
    this: Pick<CollectionState<T>, 'item' | 'items'>,
    item: T
  ) {
    this.item = item
    const found = this.items.find(({ _id }: Pick<T, '_id'>) => _id === item._id)
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

  removeItem<T extends { _id: string|null }>(
    this: Pick<CollectionState<T>, 'items'> & { item: T },
    item: T
  ) {
    this.items = this.items.filter(({ _id }: T) => item._id !== _id)
    if( this.item._id === item._id ) {
      this.item._id = null
    }

    return item
  },

  clearItem<T=any>(this: Pick<CollectionState<T>, 'item' | 'freshItem'>) {
    const item = this.item = deepClone(this.freshItem)
    return item
  },

  clearItems<T=any>(this: CollectionStateItems<T>) {
    this.items = []
  },

  async describe<T=any>(this: CollectionState<T>) {
    const t = await http.post(`${this.$id}/describe`)
    console.log(t)
  }
}

export default {
  ...mutations,
  async custom<T extends PiniaState>(
    this: CollectionState<T>,
    verb: string,
    payload?: any,
    options?: ActionOptions
  ): Promise<any> {
    this.validationErrors = {}
    if( !options?.skipLoading ) {
      this.isLoading = true
    }

    const method = options?.method || 'POST'
    const route = verb
      ? `${this.$id}/${verb}`
      : this.$id

    const promise = http[method.toLowerCase()](route, payload)
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

    return (await promise)?.data
  },

  async customEffect(
    this: { custom: (...args: any[]) => Promise<any> },
    verb: string,
    payload: any,
    fn: (data: any) => any,
    options?: ActionOptions
  ): Promise<any> {
    const response = await this.custom(verb, payload, options)
    return response?.result
      ? fn(response.result)
      : {}
  },

  async $customEffect(
    this: { custom: (...args: any[]) => Promise<any> },
    verb: string,
    payload: any,
    fn: (data: any) => any
  ): Promise<any> {
    const response = await this.custom(verb, payload)
    return fn(response)
  },

  async get<T>(payload: ActionFilter): Promise<T> {
    return this.customEffect(
      'get', payload,
      this.setItem
    )
  },

  getAll<T>(
    this: Pick<CollectionState<T>, 'pagination'> & {
      $patch: (...args: any[]) => void
      $customEffect: (...args: any[]) => Promise<any>
    },
    _payload: ActionFilter
  ): Promise<Array<T>> {
    const payload = Object.assign({}, _payload)

    if( !payload.limit ) {
      payload.limit = this.pagination.limit
    }

    if( !payload.offset ) {
      payload.offset = this.pagination.offset
    }

    return this.$customEffect(
      'getAll', payload,
      ({ result, pagination }: { result: Array<T>, pagination: Pagination }) => {
        this.$patch({
          items: result,
          pagination
        })

        return result
      }
    )
  },

  insert<T>(
    this: typeof mutations & {
      item: CollectionState<T>['item']
      customEffect: (...args: any[]) => Promise<any>
    },
    payload?: { what: Partial<T> },
    options?: ActionOptions
  ): Promise<T> {
    return this.customEffect(
      null, { ...payload, what: payload?.what||this.item },
      this.insertItem,
      options
    )
  },

  async deepInsert<T extends Record<string, any>>(
    this: typeof mutations & {
      item: CollectionState<T>['item']
      insert: (...args: any[]) => Promise<T>
      inlineReferences: any
    },
    payload?: { what: Partial<T> }
  ): Promise<T> {
    const inlineReferences = this.inlineReferences
    const newItem = (payload?.what || this.item) as Record<string, any>

    for( const [k, { collection }] of inlineReferences ) {
      if(
        newItem[k]
        && typeof newItem[k] === 'object'
        && Object.keys(newItem[k]).length > 0
      ) {
        const helperStore = useStore(collection)
        const result = await helperStore.insert({
          what: newItem[k]
        })

        newItem[k] = result._id
      }
    }

    return this.insert({
      what: newItem
    })
  },

  delete<T extends { _id: string }>(
    this: typeof mutations & {
      item: CollectionState<T>['item']
      customEffect: (...args: any[]) => Promise<any>
    },
    payload: { filters?: Pick<T, '_id'> }
  ): Promise<T> {
    return this.customEffect(
      'delete', { filters: { _id: payload?.filters?._id } },
      this.removeItem
    )
  },

  filter<T>(
    this: {
      $filters: CollectionGetters['$filters']
      pagination: CollectionState<T>['pagination']
      getAll: (...args: any[]) => Promise<Array<T>>
    },
    props: {
      project: Array<string>
    }
  ) {
    return this.getAll({
      filters: this.$filters,
      limit: this.pagination.limit,
      ...props||{}
    })
  },

  clearFilters<T>(
    this: Pick<CollectionState<T>, 'filters' | 'freshFilters' | 'pagination'> & {
      filter: (...args: any[]) => Promise<Array<T>>
    }
  ) {
    const filters = this.filters = deepClone(this.freshFilters)
    this.pagination.offset = 0
    this.filter()

    return filters
  },

  async ask(props: {
    action: (params: any) => unknown,
    params: any
    title?: string
    body?: string
  }) {
    const metaStore = useMetaStore()
    const answer = await metaStore.spawnPrompt({
      body: props.body || 'A ação que você está prestes a fazer é irreversível. Tem certeza de que deseja prosseguir?',
      actions: [
        {
          name: 'cancel',
          title: 'Cancelar',
          variant: 'transparent'
        },
        {
          name: 'confirm',
          title: 'Confirmar',
          size: 'large'
        },
      ]
    })

    if( answer.name === 'confirm' ) {
      const { action, params } = props
      return action(params)
    }
  },

  useFields(
    this: Pick<CollectionGetters, 'fields'>,
    fields: Array<string>,
  ): Record<string, CollectionField> {
    return fields.reduce((a: any, field: string) => {
      if( !(field in this.fields) ) {
        return a
      }

      return {
        ...a,
        [field]: this.fields[field]
      }

    }, {})
  },

  useFieldsExcept(
    this: Pick<CollectionGetters, 'fields'>,
    fields: Array<string>,
  ): Record<string, CollectionField> {
    return fromEntries(Object.entries(this.fields)
      .filter(([key]: [string, unknown]) => !fields.includes(key)))
  },

  formatValue<T>(
    this: Pick<CollectionState<T>, 'rawDescription'>,
    args: {
      value: string|object,
      key: string,
      form: boolean,
      field: CollectionField
    }
  ): string
    {
      return Collection.formatValue(
        this.rawDescription as Pick<CollectionDescription, 'fields'>,
        args.value,
        args.key,
        args.form,
        args.field
      )
  },

  getIndexes<T>(
    this: Pick<CollectionState<T>, 'rawDescription'>,
    args:  { key: string, form: boolean }
  ): Array<string> {
    return Collection.getIndexes(
      this.rawDescription as Pick<CollectionDescription, 'fields'>,
      args.key,
      args.form
    )
  }
}
