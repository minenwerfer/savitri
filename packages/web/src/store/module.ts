import { Router } from 'vue-router'
import {
  RequestProvider,
  AxiosResponse,
  fromEntries,
  withIsomorphicLock

} from '../../../common'

declare global {
  interface Window {
    _queryCache?: any
    _router: Router
  }
}

export const SV_API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api'
  : '/api'

export const SV_API_URL_2 = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001/api'
  : '/api2'

export type DispatchFunction = (action: string, payload?: any, options?: any) => Promise<any> | any
export type CommitFunction = DispatchFunction

/**
 * @exports @interface
 * Dispatch and commit functions.
 */
export interface ContextFunctions {
  commit: CommitFunction
  dispatch: DispatchFunction
}

/**
 * @exports @interface
 * Action properties.
 */
export type ActionProps = ContextFunctions & {
  state: CommonState
  getters?: any
  rootGetters?: any
  rootState?: any
}

/**
 * @exports @interface
 * Object passed to commit() when actionHelper succeeds.
 */
export interface MutationProps {
  result?: any
  props?: any
  payload: {
    filters?: any|Array<any>
  }
}

/**
 * @exports @interface
 * Will add the dispatcher function as the first argument for spawning errors.
 */
export interface ProxiedRequestProvider {
  post: (ctx: ContextFunctions, route: string, payload: any) => Promise<AxiosResponse>
  get: (ctx: ContextFunctions, route: string) => Promise<AxiosResponse>
}

export interface CommonState {
  isLoading: boolean
  item: any
  items: Array<any>
  recordsCount: number
  recordsTotal: number
  currentPage: number
  _clearItem: any
  _limit: number
  _halt: boolean
  _filters: any
  _queryCache: any
  __description: any
  _description: {
    actions?: any
    individualActions?: any
    fields?: any
    table?: Array<string>
    filters?: any
  }
  selected: Array<any>
  defaultFilters?: any
}

export const normalizeFilters = (filters: Array<any>) => {
  return filters
  .reduce((a: any, b: any) => {
    const filter = typeof b !== 'string'
      ? { [b.field]: b.default||'' }
      : { [b]: '' }

      return {
        ...a,
        ...filter
      }
  }, {})
}

export const normalizeValues = (values: any|Array<any>) => {
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
    currentPage: 0,
    _clearItem: {},
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

  private _filters: any
  private _description: { fields: any, filters: any }

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
  constructor(route: string, initialState: any, initialItemState: Item, description?: any, apiUrl?: string) {
    this._initialState = initialState
    this._initialItemState = initialItemState

    this._description = description

    if( description?.filters ) {
      this._commonState._filters = description.filters
    }

    if( initialState.defaultFilters ) {
      Object.assign(this._commonState._filters, initialState.defaultFilters)
    }

    this._filters = {
      ...((this._initialState as any)._filters || {}),
      ...this._commonState._filters,
    }

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
    const _httpMethodWrapper = (target: RequestProvider, method: any, ctx: ContextFunctions, ...args: any) =>
      new Promise((resolve, reject) => {
      const call = method.apply(target, ...args)
      if( !(call instanceof Promise) ) {
        return call
      }

      return call
        .then(resolve)
        .catch(async (error: string) => {
          if( error === 'signed out' ) {
            ctx.dispatch('user/signout', {}, { root: true })

            await ctx.dispatch('meta/spawnModal', {
              title: 'Sua sessão expirou',
              body: 'Você será redirecionado para a página de login.',

            }, { root: true });

            window._router.push({ name: 'signin' })

          } else {
            ctx.commit('meta/MODAL_SPAWN', {
              title: 'Erro',
              body: error

            }, { root: true })

          }

          console.trace(error)
          reject(error)
        })
    })

    this._proxiedHttp = new Proxy(this._http, {
      get: (target: any, key: string) => {
        const method = target[key]

        return ['request', 'get', 'post'].includes(key)
          ? (ctx: ContextFunctions, ...args: any) => _httpMethodWrapper(target, method, ctx, [...args])
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

  protected route(verb?: string) {
    return verb
      ? `${this._route}/${verb}`
      : this._route
  }

  protected actionHelper<T_>(verb: string, mutation?: string, transform: (what: any) => any = (what) => what) {
    const route = this.route(verb)
    return ({ commit, dispatch, state }: ContextFunctions & { state: any }, value?: any): Promise<T_> => new Promise((resolve, reject) => {
      state._halt = false
      dispatch('swapLoading', true)

      const { payload, ...props } = value
        ? { ...value, payload: transform(value.payload) }
        : { payload: undefined }

      this.http.post({ commit, dispatch }, route, { ...payload, ...props })
        .then((response: AxiosResponse) => {
          const data = response?.data || {}
          if( state._halt ) {
            return reject('operation halted')
          }

          const result = data.result || data
          if( mutation ) {
            commit(mutation, { result, payload, props })
          }

          if( typeof data.recordsCount === 'number' || typeof data.recordsTotal === 'number' ) {
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
    const normalize = (data: any, value: any) => data
      .reduce((a: any, item: any) => ({
        ...a,
        [item._id]: item[Array.isArray(value.index) ? value.index[0] : value.index]
      }), {})

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

      return withIsomorphicLock(`dynamicQuery:${value.module}`, async () => {
        const stored = window._queryCache?.[value.module]||[]

        const hasToUpdate = typeof value.limit === 'number'
          && (value.limit > stored.length || value.limit === 0)

        if( stored?.length > 0 && !hasToUpdate ) {
          return normalize(stored, value)
        }

        if( hasToUpdate && stored ) {
          value.offset = stored.length
        }

        /**
         * @remarks This empty entry will prevent duplicate requests.
         */
        if( !window._queryCache ) {
          window._queryCache = {}
        }

        /**
         * @remarks optimization
         */
        if( !sessionStorage.getItem('auth:token') && !value.public ) {
          return {}
        }

        const route = `${value.module}/getAll`

        const { data } = await this._http.post(route, {
          filters: value.filters || {},
          project: value.index || {},
          limit: value.limit,
          offset: value.offset
        })

        const result = normalize([
          ...stored,
          ...data.result
        ], value)

        window.dispatchEvent(new CustomEvent('__updateQueryCache', {
          detail: {
            parentModule: this._route,
            moduleName: value.module,
            result: data.result
          }
        }))

        return result
      })
    }

    const entries = Array.isArray(obj)
      ? obj.map((i) => Object.entries(i)[0])
      : Object.entries(obj)

    const result: any = array ? [] : {}

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

  private _condenseItem(item: any) {
    return Object.entries(item||{})
    .reduce((a:any, [key, value]: [string, any]) => ({
      ...a,
      [key]: value && typeof value === 'object' && '_id' in value ? { _id: value._id } : value
    }), {})
  }

  private _removeEmpty(item: any) {
    const entries = Object.entries(item)
    .filter(([_, value]: [unknown, any]) => value && !(typeof value === 'string' && value.length === 0))

    return fromEntries(entries)
  }


  public state() {
    return {
      ...this._commonState,
      ...this._initialState,
      _filters: this._filters,
      item: {
        ...this._initialItemState
      }
    }
  }

  protected _getters()  {
    return {
      queryCache: (state: CommonState) => state._queryCache,

      item: (state: CommonState) => {
        const merge = Object.entries(state._clearItem)
          .reduce((a: any, [key, value]: [string, any]) => ({
            ...a,
            [key]: state.item[key] || value
          }), {})


        return Object.assign(state.item, merge)
      },

      condensedItem: (state: CommonState) => this._condenseItem(state.item),

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

      actions: (state: CommonState) => {
        const entries = Object.entries(state._description.actions||{})
          .filter(([, value]: [unknown, any]) => !!value)

        return fromEntries(entries)
      },

      /**
       * @function
       * @see components/reusable/CTable/CTable.vue
       * Returns individual actions in array format.
       */
      individualActions: (state: CommonState) => {
        return Object.entries(state._description.individualActions||{})
          .filter(([, value]: [unknown, any]) => !!value)
          .reduce((a: Array<object>, [key, value]: [string, any]) => [
            ...a,
            {
              action: key,
              ...value
            }
          ], [])
      },

      filters: (state: CommonState) => {
        const filters = this._removeEmpty(state._filters)

        const expr = (key: string, value: any) => {
          const field = ((this._description||state._description).fields||{})[key]

          // TODO: debug this
          if( !field ) {
            return
          }

          if( field.type === 'text' ) {
            return {
              $regex: value,
              $options: 'i'
            }
          }

          const values = Array.isArray(field.values) ? field.values[0] : field.values
          const query = values?.__query

          if( query?.module ) {
            return { _id: value }
          }

          return value
        }

      const entries = Object.entries(filters)
        .filter(([_, value]: [unknown, any]) => value && !(typeof value === 'string' &&  value.length === 0))
        .map(([key, value]) => [key, expr(key, value)])


        return this._condenseItem(fromEntries(entries))
      },

      availableFilters: (state: CommonState) => {
        if( !state._description?.filters ) {
          return {}
        }

        const fields = this._getters().fields(state)

        return Object.keys(normalizeFilters(state._description.filters))
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

      limit: (state: CommonState) => {
        return state._limit
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
        return Object.entries(state._description?.fields||{})
          .reduce((a: object, [key, value]: [string, any]) => ({
            ...a,
            [key]: {
              ...value,
              type: ![undefined].includes(value.type)
                ? value.type : typeof value.module === 'string'
                ? 'module' : 'text',

              ...(!!value.values ? { values: normalizeValues(value.values) } : {})
            }
          }), {})
      }
    }
  }

  protected _actions() {
    return {
      swapLoading: ({ commit }: ActionProps, value?: boolean): void => {
        commit('LOADING_SWAP', value)
        commit('meta/GLOBAL_LOADING_SWAP', value, { root: true })
      },

      describe: this.actionHelper<any>('describe', 'DESCRIPTION_SET'),

      get: (...args:any) => {
        const func = this.actionHelper<Item>('get', 'ITEM_GET')
        const [{ state }]: [ActionProps, unknown] = args

        const { force } = args[1] || {}

        const every = (target: any, filters: any) => Object.entries(filters)
          .every(([key, value]: [string, any]) => target[key] === value)

        const found = !force && state.items.find((item: Item) => every(item, args[1].filters)) 
        return !found
          ? func.apply(this, args)
          : found
      },

      getAll: this.actionHelper<Array<Item>>('getAll', 'ITEMS_GET'),
      insert: this.actionHelper<Item>('insert', 'ITEM_INSERT'),
      delete: this.actionHelper<Item>('delete', 'ITEM_REMOVE', (payload) => ({ ...payload, filters: { _id: payload.filters._id } })),
      deleteAll: this.actionHelper<Item>('deleteAll', 'ITEMS_REMOVE'),
      modify: this.actionHelper<Item>('modify', 'ITEM_MODIFY'),
      modifyAll: this.actionHelper<Item>('modifyAll', 'ITEMS_MODIFY'),

      deepInsert: ({ dispatch, getters }: ActionProps, payload: any) => new Promise(async (resolve) => {
        const { expandedSubmodules } = getters
        for ( const [k, { module }] of expandedSubmodules ) {
          if( payload.what[k] && typeof payload.what[k] === 'object' && Object.keys(payload.what[k]).length > 0 ) {
            payload.what[k] = await dispatch(`${module}/insert`, { what: payload.what[k] }, { root: true })
          }
        }

        const result = await dispatch('insert', payload)
        resolve(result)
      }),

      activate: ({ dispatch }: ActionProps, payload: any) => dispatch('insert', { ...payload, what: { active: true } }),
      activateAll: ({ dispatch }: ActionProps, payload: any) => dispatch('modifyAll', { ...payload, what: { active: true } }),

      deactivate: ({ dispatch }: ActionProps, payload: any) => dispatch('insert', { ...payload, what: { active: false } }),
      deactivateAll: ({ dispatch }: ActionProps, payload: any) => dispatch('modifyAll', { ...payload, what: { active: false } }),

      update: (...args:any) => {
        const func = this.actionHelper<string>('update')
        const [{ commit, dispatch }]: [ActionProps, unknown] = args

        return func.apply(this, args)
          .then((response: string) => {
            commit('ITEMS_CLEAR')
            dispatch('getAll')

            dispatch('meta/spawnModal', {
              title: 'Registros atualizados',
              body: `Resposta do servidor: ${response}`

            }, { root: true })
          })
      },

      ask: ({ dispatch }: ActionProps, { action, params, title, body }: { action: string, params: any, title?: string, body?: string}): Promise<void> => new Promise((resolve, reject) =>
        dispatch('meta/spawnPrompt', {
          title: title || 'Diálogo de confirmação',
          body: body || `Essa ação não poderá ser desfeita. Tem certeza de que deseja prosseguir?`,
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
    selectMany: ({ commit }: ActionProps, { items, value }: { items: Array<any>, value: boolean }) => commit('ITEMS_SELECT', { items, value }),
    selectAll: ({ commit, getters }: any, value:boolean = true) =>
      commit('ITEMS_SELECT', { items: getters.items, value }),

    // will getAll starting from the given offset
    paginate: (
      { commit, dispatch, state, getters }: ActionProps,
      { page, limit }: { page: number|string, limit: number }
    ): Promise<any> => new Promise((resolve) => {
      const prevPage = state.currentPage || 0
      const newPage = ['undefined', 'number'].includes(typeof page)
        ? page || prevPage
        : (typeof page === 'string' && /^(\+|-)[0-9]+$/.test(page) ? eval(`${prevPage}${page}`) : 0)

      return dispatch('getAll', {
        offset: (newPage-1) * state._limit,
        filters: {
          ...(state._description.filters||{}),
          ...getters.filters
        },
        limit
      })
        .then((res: any) => {
          commit('PAGE_UPDATE', res.page || page)
          commit('LIMIT_UPDATE', limit)
          resolve(res)
        })
    }),

    async filter({ dispatch, getters, state }: ActionProps) {
      return dispatch('getAll', {
        filters: getters.filters,
        limit: state._limit
      })
    },

    async filterClear({ dispatch, commit }: ActionProps) {
      commit('FILTERS_CLEAR')
      return dispatch('filter')
    },

    /**
     * @see components/views/CCrud/CCrud.vue
     */
    spawnAdd({ commit }: ActionProps) {
      commit('ITEM_CLEAR')
      commit('meta/CRUD_EDIT', undefined, { root: true })
    },

    spawnEdit({ commit }: ActionProps, { payload }: { payload: any }) {
      commit('ITEM_GET', { result: Object.assign({}, payload.filters) })
      commit('meta/CRUD_EDIT', undefined, { root: true })
    },

    spawnOpen({ commit }: ActionProps, { payload }: { payload: any }) {
      commit('ITEM_GET', { result: payload.filters })
      commit('meta/CRUD_OPEN', undefined, { root: true })
    }
  }
}

  protected _mutations() {
    return {
      DESCRIPTION_SET: async (state: CommonState, description: any) => {
        state._description = {
          ...description,
          fields: await this._parseQuery(description.fields, false)
        }

        state.__description = description

        if( !state.item || Object.keys(state.item).length === 0 ) {
          state.item = Object.entries(description.fields||{})
            .filter(([, value]: [unknown, any]) => typeof value.module === 'string' || value.type === 'object')
            .reduce((a, [key, value]: [string, any]) => ({
              ...a,
              [key]:  value.array ? [] : {}
            }), {})

          Object.entries(description.fields||{})
            .filter(([, value]: [unknown, any]) => ['checkbox', 'radio', 'boolean'].includes(value.type))
            .forEach(([key, value] : [string, any]) => {
              state.item[key] = value.type !== 'radio'
                ? (value.type === 'boolean' ? false : [])
                : ''
          })
        }

        state._clearItem = Object.assign({}, state.item)
      },

      CACHE_QUERY: (state: CommonState, { moduleName, result }: { moduleName: string, result: any }) => {
        state._queryCache[moduleName] = result

        window._queryCache[moduleName] = [
          ...(window._queryCache[moduleName]||[]),
          ...result
        ]
      },

      LOADING_SWAP: (state: CommonState, value: boolean) => {
        state.isLoading = typeof value === 'boolean' ? value : !state.isLoading
      },

      PAGE_UPDATE: (state: CommonState, offset: number) => {
        state.currentPage = offset
      },

      LIMIT_UPDATE: (state: CommonState, limit: number) => {
        state._limit = limit
      },

      COUNT_UPDATE: (state: CommonState, { recordsCount, recordsTotal, offset, limit }: any) => {
        if( recordsCount ) state.recordsCount = recordsCount
        if( recordsTotal ) state.recordsTotal = recordsTotal
        // if( offset ) state.currentPage = offset
        if( limit ) state._limit = limit
      },

      ITEM_GET: (state: CommonState, { result }: MutationProps) => {
        state.item = result
      },

      ITEMS_GET: (state: CommonState, { result }: MutationProps) => {
        state.items = result
        // const newItems = result.filter((item: Item & { _id: string }) => {
        //   return !state.items.find(({ _id }: { _id: string }) => item._id === _id )
        // })

        // state.items = [
        //   ...state.items,
        //   ...newItems
        // ]
      },

      ITEM_INSERT: (state: CommonState, { result }: MutationProps) => {
        state.item = result
        const found = state.items.find(({ _id }: any) => result._id === _id)
        if( found ) {
          Object.assign(found, result)
          return
        }

        state.items = [
          result,
          ...state.items,
        ]
      },

      ITEM_MODIFY: (state: CommonState, { props }: MutationProps) => {
        state.item = {
          ...state.item,
          ...props
        }
      },

      ITEMS_MODIFY: (state: CommonState, { props: { what }, payload }: MutationProps) => {
        const satisfiesFilter = (item: Item & any) =>
          Object.entries(payload.filters)
            .every(([key, value]: [string, any]) => Array.isArray(value) ? value.includes(item[key]) : value === item[key])

        state.items = state.items
          .map((item: Item) => ({
            ...item,
            ...(satisfiesFilter(item) ? what : {})
          }))
      },

      ITEM_REMOVE: (state: CommonState, { result }: MutationProps) => {
        state.items = state.items.filter(({ _id }: any) => result._id !== _id)
      },

      ITEMS_REMOVE: (state: CommonState, { payload }: MutationProps) => {
        state.items = state.items.filter(({ _id }: any) => !payload.filters?._id?.includes(_id))
      },

      ITEM_CLEAR: (state: CommonState) => {
        state.item = Object.assign({}, state._clearItem)
      },

      ITEMS_CLEAR: (state: CommonState) => {
        state._halt = true
        state.items = []
      },

      ITEM_SELECT: (state: CommonState, { item, value }: { item: any, value?: boolean }) => {
        const select = (i: any) => [ ...state.selected, Object.assign({}, i) ]
        const unselect = (i: any) => state.selected.filter(({ _id }: any) => _id !== i._id)

        state.selected = value === false
          ? unselect(item)
          : (state.selected.some(({ _id }: any) => _id === item._id)
            ? unselect(item) : select(item))
      },

      ITEMS_SELECT: (state: CommonState, { items, value }: { items: Array<any>, value: boolean }) => {
        state.selected = value ? items.map(({ _id }: { _id: string }) => ({ _id })) ||[] : []
      },

      FILTERS_SET: (state: CommonState, filters: any) => {
        state._filters = filters
      },

      FILTERS_CLEAR: (state: CommonState) => {
        state._filters = normalizeFilters(this._description?.filters || [])
      },
    }
}
}
