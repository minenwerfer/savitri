import { RequestProvider, AxiosResponse } from 'common/http'
import { fromEntries } from 'common/helpers'

import { default as webpackVariables } from 'variables'

export const SV_API_URL = process.env.NODE_ENV === 'development'
  ? 'http://0.0.0.0:3000/api'
  : '/api'

export const SV_API_URL_2 = (webpackVariables as any).domain ? (process.env.NODE_ENV === 'development'
  ? 'http://0.0.0.0:3001/api'
  : '/api2') : SV_API_URL

export type DispatchFunction = (action: string, payload?: any, options?: any) => Promise<any> | any
export type CommitFunction = DispatchFunction

/**
 * @exports @interface
 * Action properties.
 */
export interface ActionProps {
  state: CommonState
  getters: any
  rootGetters: any
  commit: CommitFunction
  dispatch: DispatchFunction
}

/**
 * @exports @interface
 * Object passed to commit() when _actionHelper succeeds.
 */
export interface MutationProps {
  result?: any
  props?: any
  payload: {
    filter?: any|any[]
  }
}

/**
 * @exports @interface
 * Will add the dispatcher function as the first argument for spawning errors.
 */
export interface ProxiedRequestProvider {
  post: (commit: CommitFunction, route: string, payload: any) => Promise<AxiosResponse>
  get: (commit: CommitFunction, route: string) => Promise<AxiosResponse>
}

export interface CommonState {
  isLoading: boolean
  item: any
  items: any[]
  recordsCount: number
  recordsTotal: number
  _clearItem: any
  _offset: number
  _limit: number
  _halt: boolean
  _filters: any
  _queryCache: any
  __description: any
  _description: {
    actions?: any
    individualActions?: any
    fields?: any
    table?: string[]
    filters?: any
  }
  selected: any[]
}

/**
 * @exports @abstract @class
 * Generic module with useful helpers.
 */
export abstract class Module<T=any, Item=any> {
  private _moduleInstance!: Module<T, Item>
  private _route: string
  protected _http!: RequestProvider
  protected _proxiedHttp!: RequestProvider & ProxiedRequestProvider

  private _initialState: T
  private _initialItemState: Item
  private _commonState: CommonState = {
    isLoading: false,
    item: {},
    items: [],
    recordsCount: 0,
    recordsTotal: 0,
    _clearItem: {},
    _offset: 0,
    _limit: 0,
    _halt: false,
    _filters: {},
    _queryCache: {},
    __description: {},
    _description: {
      actions: {},
      fields: {}
    },
    selected: [],
  }

  public namespaced = true

  /**
   * @constructor
   * Creates a proxy whose function is to merge common props with the child's ones.
   *
   * @param {string} route - API route
   * @param {object} initialState - initial state
   * @param {object} initialItemState - initial item state
   * @param {string} apiUrl - URL to be used in place of SV_API_URL
   */
  constructor(route: string, initialState: T, initialItemState: Item, apiUrl?: string) {
    this._initialState = initialState;
    this._initialItemState = initialItemState

    this._moduleInstance = new Proxy(this, {
      get: (target: any, key: string) => {
        const method = target[key]
        if( typeof method !== 'function') {
          return method
            ? method
            : target[`_${key}`] && target[`_${key}`].call(target)
        }

        // common props will be prefixed with an underscore
        return {
          ...(`_${key}` in target ? target[`_${key}`].call(target) : {}),
          ...method.call(target),
        }
      }
    })

    this._route = route
    this._http = new RequestProvider({
      baseURL: apiUrl || SV_API_URL,
    })

    /**
     * @function
     * Catchs errors then spawns a modal.
     */
    const _httpMethodWrapper = (target: RequestProvider, method: any, commit: CommitFunction, ...args: any) => new Promise((resolve, reject) => {
      const call = method.apply(target, ...args)
      if( !(call instanceof Promise) ) {
        return call
      }

      return call
        .then(resolve)
        .catch((error: string) => {
          commit('meta/MODAL_SPAWN', {
            title: 'Erro',
            body: error

          }, { root: true })

          console.trace(error)
          reject(error)
        })
    })

    this._proxiedHttp = new Proxy(this._http, {
      get: (target: any, key: string) => {
        const method = target[key]

        return ['request', 'get', 'post'].includes(key)
          ? (commit: CommitFunction, ...args: any) => _httpMethodWrapper(target, method, commit, [...args])
          : (typeof method === 'function' ? (...args: any) => method.apply(target, args) : method)
      }
    })
  }

  get module(): Module<T, Item> {
    return this._moduleInstance;
  }

  get http(): ProxiedRequestProvider {
    return this._proxiedHttp
  }

  protected route(verb: string) {
    return `${this._route}/${verb}`
  }

  protected _actionHelper<T_>(verb: string, mutation?: string, transform: (what: any) => any = (what) => what) {
    const route = this.route(verb)
    return ({ commit, dispatch, state }: ActionProps, value?: any): Promise<T_> => new Promise((resolve, reject) => {
      state._halt = false
      dispatch('swapLoading', true)

      const { payload, ...props } = value
        ? { ...value, payload: transform(value.payload) }
        : { payload: undefined }

      this.http.post(commit, route, { ...payload, ...props })
        .then((response: AxiosResponse) => {

          const data = response?.data || {}
          if( state._halt ) {
            return reject('operation halted')
          }

          const result = data.result || data
          if( mutation ) {
            commit(mutation, { result, payload, props })
          }

          if( data.recordsCount || data.recordsTotal ) {
            commit('COUNT_UPDATE', {
              recordsCount: data.recordsCount,
              recordsTotal: data.recordsTotal,
              offset: data.offset,
              limit: data.limit,
            })
          }

          resolve(result)
        })
        .catch((error) => reject(error))
        .finally(() => dispatch('swapLoading', false))
    })
  }

  protected async _parseQuery(obj: any, array: boolean = false): Promise<any> {

    const parse = async ([key, value]: [string, any]) => {
      if( key !== '__query' ) {
        if( array ) {
          return obj
        }

        return {
          [key]: typeof value === 'object'
            ? await this._parseQuery(value, Array.isArray(value))
            : value
        }
      }

      if( !value.module ) {
        throw new Error('dynamic query but no module is specified')
      }

      const route = `${value.module}/getAll`
      const filter = value.filter || {}

      const { data } = await this._http.post(route, filter)
      const result = data.result
        .reduce((a: any, item: any) => ({
          ...a,
          [item._id]: item[value.index]
        }), {})

      window.dispatchEvent(new CustomEvent('__updateQueryCache', {
        detail: {
          parentModule: this._route,
          module: value.module,
          result: data.result
        }
      }))

      return result
    }

    const type = array ? [] : {}

    const entries = Array.isArray(obj)
      ? obj.map((i) => Object.entries(i)[0])
      : Object.entries(obj)


    const result: any = type
    for (const pair of entries) {
      const parsed = await parse(pair)

      array
        ? result.push(parsed)
        : Object.assign(result, parsed)
    }

    return array
      ? result[0]
      : result
  }

  public state() {
    return {
      ...this._commonState,
      ...this._initialState,
      item: {
        ...this._initialItemState
      }
    }
  }

  private _getters()  {
    return {

      queryCache: (state: CommonState) => state._queryCache,

      item: (state: CommonState) => state.item,

      condensedItem: (state: CommonState) => {
        return Object.entries(state.item||{})
        .reduce((a:any, [key, value]: [string, any]) => ({
          ...a,
          [key]: typeof value === 'object' && '_id' in value ? value._id : value
        }), {})
      },

      items: (state: CommonState) => {
        if( !Array.isArray(state.items) ) return []

        const modules = Object.entries(state._description?.fields||{})
          .filter(([, value]: [unknown, any]) => typeof value.module === 'string')
          .map(([key, ]: [string, unknown]) => key)

        return state.items
          .map((item: any) => ({
            ...item,
            ...(fromEntries(modules.map((m) => [m, item[m]||{}])))
          }))
      },

      expandedSubmodules: (state: CommonState) => {
        return Object.entries(state._description.fields)
          .filter(([, value]: [unknown, any]) => typeof value.module === 'string' && value.expand === true)
      },

      /**
       * @function
       * @see components/reusable/CTable/CTable.vue
       */
      selectedIds: (state: CommonState) => state.selected.map((s:any) => s._id),

      /**
       * @function
       * @see components/reusable/CTable/CTable.vue
       * Returns individual actions in array format.
       */
      individualActions: (state: CommonState) => {
        return Object.entries(state._description.individualActions||{})
          .reduce((a: object[], [key, value]: [string, any]) => [
            ...a,
            {
              action: key,
              ...value
            }
          ], [])
      },

      filters: (state: CommonState) => state._filters,

      availableFilters: (state: CommonState) => {
        if( !state._description?.filters ) {
          return {}
        }

        const fields = this._getters().fields(state)

        return state._description.filters
        .reduce((a: object, k: string) => {
          const field = Object.entries(fields)
            .find(([key]: [string, unknown]) => key === k)

          return {
            ...a,
            ...(field ? { [k]: field[1] } : {})
          }
        }, {})
      },

      /**
       * @function
       * Raw description.
       */
      description: (state: CommonState) => {
        return state._description
      },

      /**
       * @function
       * For pagination.
       */
      currentPage: (state: CommonState) => {
        return Math.floor(state._offset / state._limit);
      },

      /**
       * @function
       * Records total / limit.
       */
      pageCount: (state: CommonState) => {
        return Math.ceil(state.recordsTotal / state._limit||1);
      },

      /**
       * @function
       * For using within CTable.
       */
      tableDescription: (state: CommonState) => {
        if( !state._description?.fields ) {
          return {}
        }

        const prepare = (value: any) => ({
            ...value,
            label: value.name?.capitalize() || value.label,
            type: value.module ? 'module' : value.type,
        })

        if( !!state._description.table ) {
          return state._description.table
            .reduce((a:object, k: string) => {
              const field = Object.entries(state._description.fields).find(([key]: [string, unknown]) => key === k)
              return {
                ...a,
                ...(field ? { [k]: prepare(field[1]) } : {})
            }}, {})
        }

        return Object.entries(state._description.fields)
        .filter(([, value]: [unknown, any]) => !value.hidden && !value.notable)
        .slice(0, 8)
        .reduce((a: object, [key, value]: [string, any]) => ({
          ...a,
          [key]: prepare(value)
        }), {})
      },

      fields: (state: CommonState) => {

        const normalizeValues = (values: any|any[]) => {
          if( Array.isArray(values) ) {
            return values.reduce((a, value) => ({
              ...a,
              [value]: {
                value,
                label: value
              }
            }), {})
          }

          return Object.entries(values)
          .reduce((a, [key, value]: [string, any]) => ({
            ...a,
            [key]: {
              value: key,
              ...(typeof value === 'string'
                 ? { label: value }
                 : value)
            }
          }), {})
        }

        return Object.entries(state._description?.fields||{})
        .reduce((a: object, [key, value]: [string, any]) => ({
          ...a,
          [key]: {
            ...value,
            type: ![undefined, 'datetime'].includes(value.type)
              ? value.type : typeof value.module === 'string'
              ? 'module' : 'text',

            ...(!!value.values ? { values: normalizeValues(value.values) } : {})
          }
        }), {})
      }
    }
  }

  private _actions() {
    return {
      swapLoading: ({ commit }: ActionProps, value?: boolean): void => {
        commit('LOADING_SWAP', value)
        commit('meta/GLOBAL_LOADING_SWAP', value, { root: true })
      },

      describe: this._actionHelper<any>('describe', 'DESCRIPTION_SET'),

      get: this._actionHelper<Item>('get', 'ITEM_GET'),
      getAll: this._actionHelper<Item[]>('getAll', 'ITEMS_GET'),
      insert: this._actionHelper<Item>('insert', 'ITEM_INSERT'),
      remove: this._actionHelper<Item>('remove', 'ITEM_REMOVE', (payload) => ({ ...payload, filter: { _id: payload.filter._id } })),
      removeAll: this._actionHelper<Item>('removeAll', 'ITEMS_REMOVE'),
      modifyAll: this._actionHelper<Item>('modifyAll', 'ITEMS_MODIFY'),

      deepInsert: ({ dispatch, getters, rootGetters }: ActionProps, payload: any) => new Promise(async (resolve) => {
        const { expandedSubmodules } = getters
        for ( const [k, { module }] of expandedSubmodules ) {
          payload.what[k] = await dispatch(`${module}/insert`, { what: payload.what[k] }, { root: true })
        }

        const result = await dispatch('insert', payload)
        resolve(result)
      }),

      activate: ({ dispatch }: ActionProps, payload: any) => dispatch('insert', { ...payload, what: { active: true } }),
      activateAll: ({ dispatch }: ActionProps, payload: any) => dispatch('modifyAll', { ...payload, what: { active: true } }),

      deactivate: ({ dispatch }: ActionProps, payload: any) => dispatch('insert', { ...payload, what: { active: false } }),
      deactivateAll: ({ dispatch }: ActionProps, payload: any) => dispatch('modifyAll', { ...payload, what: { active: false } }),

      ask: ({ dispatch }: ActionProps, { action, params }: { action: string, params: any }): Promise<void> => new Promise((resolve, reject) =>
        dispatch('meta/spawnPrompt', {
          title: 'Diálogo de confirmação',
          body: `Confirmar ação?`,
          actions: [
            { name: 'cancel', title: 'Cancelar' },
            { name: 'confirm', title: 'Confirmar', type: 'critical' }
          ]
        }, { root: true })
          .then((option: string) => {
            if( option === 'confirm' ) {
              dispatch(action, params)
              resolve()
            }
          })
          .catch(reject)
    ),

    clear: ({ commit }: ActionProps): void => commit('ITEM_CLEAR'),
    clearAll: ({ commit }: ActionProps): void => commit('ITEMS_CLEAR'),

    select: ({ commit }: ActionProps, props: any) => commit('ITEM_SELECT', props),
    selectMany: ({ commit }: ActionProps, { items, value }: { items: any[], value: boolean }) => commit('ITEMS_SELECT', { items, value }),
    selectAll: ({ commit, getters }: any, value:boolean = true) =>
      commit('ITEMS_SELECT', { items: getters['items'], value }),

    // will getAll starting from the given offset
    paginate: ({ commit, dispatch, state }: ActionProps, offset?: number|string): Promise<any> => new Promise((resolve) => {
      const prevOffset = state._offset || 0;
      const newOffset = ['undefined', 'number'].includes(typeof offset)
        ? offset || prevOffset
        : (typeof offset === 'string' && /^(\+|-)[0-9]+$/.test(offset) ? eval(`${prevOffset}${offset}`) : 0)

      return dispatch('getAll', {
        offset: (newOffset-1) * state._limit,
        filter: state._filters,
      })
        .then((res: any) => {
          commit('OFFSET_UPDATE', res.offset || offset)
          resolve(res)
        })
    }),

    /**
     * @see components/views/CCrud/CCrud.vue
     */
    spawnAdd({ commit }: ActionProps) {
      commit('ITEM_CLEAR')
      commit('meta/CRUD_EDIT', undefined, { root: true })
    },

    spawnEdit({ commit }: ActionProps, { payload }: { payload: any }) {
      commit('ITEM_GET', { result: payload.filter })
      commit('meta/CRUD_EDIT', undefined, { root: true })
    },

    spawnOpen({ commit }: ActionProps, { payload }: { payload: any }) {
      commit('ITEM_GET', { result: payload.filter })
      commit('meta/CRUD_OPEN', undefined, { root: true })
    }
  }
}

private _mutations() {
  return {
    DESCRIPTION_SET: async (state: CommonState, value: any) => {
      state._description = {
        ...value,
        fields: await this._parseQuery(value.fields)
      }

      state.__description = value

      state.item = Object.entries(value.fields||{})
        .filter(([, value]: [unknown, any]) => typeof value.module === 'string' || value.type === 'object')
        .reduce((a, [key, value]: [string, any]) => ({
          ...a,
          [key]:  value.array ? [] : {}
        }), {})


      Object.entries(value.fields||{})
        .filter(([, value]: [unknown, any]) => ['checkbox', 'radio'].includes(value.type))
        .forEach(([key, value] : [string, any]) => {
          state.item[key] = value.type === 'radio' ? '' : []
      })

      state._clearItem = Object.assign({}, state.item)
    },

    CACHE_QUERY: (state: CommonState, { module, result }: { module: string, result: any }) => {
      state._queryCache[module] = result
    },

    LOADING_SWAP(state: CommonState, value: boolean) {
      state.isLoading = typeof value === 'boolean' ? value : !state.isLoading;
    },

    OFFSET_UPDATE(state: CommonState, offset: number) {
      state._offset = offset;
    },

    COUNT_UPDATE(state: CommonState, { recordsCount, recordsTotal, offset, limit }: any) {
      if( recordsCount ) state.recordsCount = recordsCount
      if( recordsTotal ) state.recordsTotal = recordsTotal
      if( offset ) state._offset = offset;
      if( limit ) state._limit = limit;
    },

    ITEM_GET(state: CommonState, { result }: MutationProps) {
      state.item = result
    },

    ITEMS_GET(state: CommonState, { result }: MutationProps) {
      state.items = result;
    },

    ITEM_INSERT(state: CommonState, { result }: MutationProps) {
      const found = state.items.filter(({ _id }: any) => result._id === _id).length > 0
      if( found ) {
        state.items = state.items.map((item: T & { _id: string }) => ({
          ...(item._id === result._id ? result : item)
        }))
        return
      }

      state.item = result
      state.items = [
        result,
        ...state.items,
      ]
    },

    // ITEM_MODIFY(state: CommonState, { props }: MutationProps) {
    //   state.item = {
    //     ...state.item,
    //     ...props
    //   }
    // },

    ITEMS_MODIFY(state: CommonState, { props: { what }, payload }: MutationProps) {
      const satisfiesFilter = (item: Item & any) =>
        Object.entries(payload.filter)
          .every(([key, value]: [string, any]) => Array.isArray(value) ? value.includes(item[key]) : value === item[key])

      state.items = state.items
        .map((item: Item) => ({
          ...item,
          ...(satisfiesFilter(item) ? what : {})
        }))
    },

    ITEM_REMOVE(state: CommonState, { result }: MutationProps) {
      state.items = state.items.filter(({ _id }: any) => result._id !== _id)
    },

    ITEMS_REMOVE(state: CommonState, { payload }: MutationProps) {
      state.items = state.items.filter(({ _id }: any) => !payload.filter?._id?.includes(_id))
    },

    ITEM_CLEAR(state: CommonState) {
      state.item = Object.assign({}, state._clearItem)
    },

    ITEMS_CLEAR(state: CommonState) {
      state._halt = true
      state.items = []
    },

    ITEM_SELECT(state: CommonState, { item, value }: { item: any, value?: boolean }) {
      const select = (item: any) => [ ...state.selected, Object.assign({}, item) ]
      const unselect = (item: any) => state.selected.filter(({ _id }: any) => _id !== item._id)

      state.selected = value === false
        ? unselect(item)
        : (state.selected.some(({ _id }: any) => _id === item._id)
          ? unselect(item) : select(item))
    },

    ITEMS_SELECT(state: CommonState, { items, value }: { items: any[], value: boolean }) {
      state.selected = value ? items.map(({ _id }: { _id: string }) => ({ _id })) ||[] : []
    },

    FILTERS_CLEAR(state: CommonState) {
      state._filters = {}
    }
  }
}
}
