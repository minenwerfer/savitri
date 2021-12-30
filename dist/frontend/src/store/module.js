"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = exports.PZ_API_URL = void 0;
const http_1 = require("common/http");
const helpers_1 = require("common/helpers");
exports.PZ_API_URL = process.env.NODE_ENV === 'development'
    ? 'http://172.16.0.91:3000/api'
    : '/api';
/**
 * @exports @abstract @class
 * Generic module with useful helpers.
 */
class Module {
    _moduleInstance;
    _route;
    _http;
    _proxiedHttp;
    _initialState;
    _initialItemState;
    _commonState = {
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
    };
    namespaced = true;
    /**
     * @constructor
     * Creates a proxy whose function is to merge common props with the child's ones.
     *
     * @param {object} initialState - initial state
     * @param {string} route - API route
     */
    constructor(route, initialState, initialItemState) {
        this._initialState = initialState;
        this._initialItemState = initialItemState;
        this._moduleInstance = new Proxy(this, {
            get: (target, key) => {
                const method = target[key];
                if (typeof method !== 'function') {
                    return method
                        ? method
                        : target[`_${key}`] && target[`_${key}`].call(target);
                }
                // common props will be prefixed with an underscore
                return {
                    ...(`_${key}` in target ? target[`_${key}`].call(target) : {}),
                    ...method.call(target),
                };
            }
        });
        this._route = route;
        this._http = new http_1.RequestProvider({
            baseURL: exports.PZ_API_URL,
        });
        /**
         * @function
         * Catchs errors then spawns a modal.
         */
        const _httpMethodWrapper = (target, method, commit, ...args) => new Promise((resolve, reject) => {
            const call = method.apply(target, ...args);
            if (!(call instanceof Promise)) {
                return call;
            }
            return call
                .then(resolve)
                .catch((error) => {
                commit('meta/MODAL_SPAWN', {
                    title: 'Erro',
                    body: error
                }, { root: true });
                console.trace(error);
                reject(error);
            });
        });
        this._proxiedHttp = new Proxy(this._http, {
            get: (target, key) => {
                const method = target[key];
                return ['request', 'get', 'post'].includes(key)
                    ? (commit, ...args) => _httpMethodWrapper(target, method, commit, [...args])
                    : (typeof method === 'function' ? (...args) => method.apply(target, args) : method);
            }
        });
    }
    get module() {
        return this._moduleInstance;
    }
    get http() {
        return this._proxiedHttp;
    }
    route(verb) {
        return `${this._route}/${verb}`;
    }
    _actionHelper(verb, mutation, transform = (what) => what) {
        const route = this.route(verb);
        return ({ commit, dispatch, state }, value) => new Promise((resolve, reject) => {
            state._halt = false;
            dispatch('swapLoading', true);
            const { payload, ...props } = value
                ? { ...value, payload: transform(value.payload) }
                : { payload: undefined };
            this.http.post(commit, route, { ...payload, ...props })
                .then((response) => {
                const data = response?.data || {};
                if (state._halt) {
                    return reject('operation halted');
                }
                const result = data.result || data;
                if (mutation) {
                    commit(mutation, { result, payload, props });
                }
                if (data.recordsCount || data.recordsTotal) {
                    commit('COUNT_UPDATE', {
                        recordsCount: data.recordsCount,
                        recordsTotal: data.recordsTotal,
                        offset: data.offset,
                        limit: data.limit,
                    });
                }
                resolve(result);
            })
                .catch((error) => reject(error))
                .finally(() => dispatch('swapLoading', false));
        });
    }
    async _parseQuery(obj, array = false) {
        const parse = async ([key, value]) => {
            if (key !== '__query') {
                if (array) {
                    return obj;
                }
                return {
                    [key]: typeof value === 'object'
                        ? await this._parseQuery(value, Array.isArray(value))
                        : value
                };
            }
            if (!value.module) {
                throw 'dynamic query but no module is specified';
            }
            const route = `${value.module}/getAll`;
            const filter = value.filter || {};
            const { data } = await this._http.post(route, filter);
            const result = data.result
                .reduce((a, item) => ({
                ...a,
                [item._id]: item[value.index]
            }), {});
            window.dispatchEvent(new CustomEvent('__updateQueryCache', {
                detail: {
                    parentModule: this._route,
                    module: value.module,
                    result: data.result
                }
            }));
            return result;
        };
        const type = array ? [] : {};
        const entries = Array.isArray(obj)
            ? obj.map((i) => Object.entries(i)[0])
            : Object.entries(obj);
        const result = type;
        for (const pair of entries) {
            const parsed = await parse(pair);
            array
                ? result.push(parsed)
                : Object.assign(result, parsed);
        }
        return array
            ? result[0]
            : result;
    }
    state() {
        return {
            ...this._commonState,
            ...this._initialState,
            item: {
                ...this._initialItemState
            }
        };
    }
    _getters() {
        return {
            item: (state) => state.item,
            condensedItem: (state) => {
                return Object.entries(state.item || {})
                    .reduce((a, [key, value]) => ({
                    ...a,
                    [key]: typeof value === 'object' && '_id' in value ? value._id : value
                }), {});
            },
            items: (state) => {
                if (!Array.isArray(state.items))
                    return [];
                const modules = Object.entries(state._description?.fields || {})
                    .filter(([, value]) => typeof value.module === 'string')
                    .map(([key,]) => key);
                return state.items
                    .map((item) => ({
                    ...item,
                    ...((0, helpers_1.fromEntries)(modules.map((m) => [m, item[m] || {}])))
                }));
            },
            expandedSubmodules: (state) => {
                return Object.entries(state._description.fields)
                    .filter(([, value]) => typeof value.module === 'string' && value.expand === true);
            },
            /**
             * @function
             * @see components/reusable/CTable/CTable.vue
             */
            selectedIds: (state) => state.selected.map((s) => s._id),
            /**
             * @function
             * @see components/reusable/CTable/CTable.vue
             * Returns individual actions in array format.
             */
            individualActions: (state) => {
                return Object.entries(state._description.individualActions || {})
                    .reduce((a, [key, value]) => [
                    ...a,
                    {
                        action: key,
                        ...value
                    }
                ], []);
            },
            filters: (state) => state._filters,
            availableFilters: (state) => {
                if (!state._description?.filters) {
                    return {};
                }
                const fields = this._getters().fields(state);
                return state._description.filters
                    .reduce((a, k) => {
                    const field = Object.entries(fields)
                        .find(([key]) => key === k);
                    return {
                        ...a,
                        ...(field ? { [k]: field[1] } : {})
                    };
                }, {});
            },
            /**
             * @function
             * Raw description.
             */
            description: (state) => {
                return state._description;
            },
            /**
             * @function
             * For pagination.
             */
            currentPage: (state) => {
                return Math.floor(state._offset / state._limit);
            },
            /**
             * @function
             * Records total / limit.
             */
            pageCount: (state) => {
                return Math.ceil(state.recordsTotal / state._limit || 1);
            },
            /**
             * @function
             * For using within CTable.
             */
            tableDescription: (state) => {
                if (!state._description?.fields) {
                    return {};
                }
                const prepare = (value) => ({
                    ...value,
                    label: value.name?.capitalize() || value.label,
                    type: value.module ? 'module' : value.type,
                });
                if (!!state._description.table) {
                    return state._description.table
                        .reduce((a, k) => {
                        const field = Object.entries(state._description.fields).find(([key]) => key === k);
                        return {
                            ...a,
                            ...(field ? { [k]: prepare(field[1]) } : {})
                        };
                    }, {});
                }
                return Object.entries(state._description.fields)
                    .filter(([, value]) => !value.hidden && !value.notable)
                    .slice(0, 8)
                    .reduce((a, [key, value]) => ({
                    ...a,
                    [key]: prepare(value)
                }), {});
            },
            fields: (state) => {
                const normalizeValues = (values) => {
                    if (Array.isArray(values)) {
                        return values.reduce((a, value) => ({
                            ...a,
                            [value]: {
                                value,
                                label: value
                            }
                        }), {});
                    }
                    return Object.entries(values)
                        .reduce((a, [key, value]) => ({
                        ...a,
                        [key]: {
                            value: key,
                            ...(typeof value === 'string'
                                ? { label: value }
                                : value)
                        }
                    }), {});
                };
                return Object.entries(state._description?.fields || {})
                    .reduce((a, [key, value]) => ({
                    ...a,
                    [key]: {
                        ...value,
                        type: ![undefined, 'datetime'].includes(value.type)
                            ? value.type : typeof value.module === 'string'
                            ? 'module' : 'text',
                        ...(!!value.values ? { values: normalizeValues(value.values) } : {})
                    }
                }), {});
            }
        };
    }
    _actions() {
        return {
            swapLoading: ({ commit }, value) => {
                commit('LOADING_SWAP', value);
                commit('meta/GLOBAL_LOADING_SWAP', value, { root: true });
            },
            describe: this._actionHelper('describe', 'DESCRIPTION_SET'),
            get: this._actionHelper('get', 'ITEM_GET'),
            getAll: this._actionHelper('getAll', 'ITEMS_GET'),
            insert: this._actionHelper('insert', 'ITEM_INSERT'),
            remove: this._actionHelper('remove', 'ITEM_REMOVE', (payload) => ({ ...payload, filter: { _id: payload.filter._id } })),
            removeAll: this._actionHelper('removeAll', 'ITEMS_REMOVE'),
            modifyAll: this._actionHelper('modifyAll', 'ITEMS_MODIFY'),
            deepInsert: ({ dispatch, getters, rootGetters }, payload) => new Promise(async (resolve) => {
                const { expandedSubmodules } = getters;
                for (const [k, { module }] of expandedSubmodules) {
                    payload.what[k] = await dispatch(`${module}/insert`, { what: payload.what[k] }, { root: true });
                }
                const result = await dispatch('insert', payload);
                resolve(result);
            }),
            activate: ({ dispatch }, payload) => dispatch('insert', { ...payload, what: { active: true } }),
            activateAll: ({ dispatch }, payload) => dispatch('modifyAll', { ...payload, what: { active: true } }),
            deactivate: ({ dispatch }, payload) => dispatch('insert', { ...payload, what: { active: false } }),
            deactivateAll: ({ dispatch }, payload) => dispatch('modifyAll', { ...payload, what: { active: false } }),
            ask: ({ dispatch }, { action, params }) => new Promise((resolve, reject) => dispatch('meta/spawnPrompt', {
                title: 'Diálogo de confirmação',
                body: `Confirmar ação?`,
                actions: [
                    { name: 'cancel', title: 'Cancelar' },
                    { name: 'confirm', title: 'Confirmar', type: 'critical' }
                ]
            }, { root: true })
                .then((option) => {
                if (option === 'confirm') {
                    dispatch(action, params);
                    resolve();
                }
            })
                .catch(reject)),
            clear: ({ commit }) => commit('ITEM_CLEAR'),
            clearAll: ({ commit }) => commit('ITEMS_CLEAR'),
            select: ({ commit }, props) => commit('ITEM_SELECT', props),
            selectMany: ({ commit }, { items, value }) => commit('ITEMS_SELECT', { items, value }),
            selectAll: ({ commit, getters }, value = true) => commit('ITEMS_SELECT', { items: getters['items'], value }),
            // will getAll starting from the given offset
            paginate: ({ commit, dispatch, state }, offset) => new Promise((resolve) => {
                const prevOffset = state._offset || 0;
                const newOffset = ['undefined', 'number'].includes(typeof offset)
                    ? offset || prevOffset
                    : (typeof offset === 'string' && /^(\+|-)[0-9]+$/.test(offset) ? eval(`${prevOffset}${offset}`) : 0);
                return dispatch('getAll', {
                    offset: (newOffset - 1) * state._limit,
                    filter: state._filters,
                })
                    .then((res) => {
                    commit('OFFSET_UPDATE', res.offset || offset);
                    resolve(res);
                });
            }),
            /**
             * @see components/views/CCrud/CCrud.vue
             */
            spawnAdd({ commit }) {
                commit('ITEM_CLEAR');
                commit('meta/CRUD_EDIT', undefined, { root: true });
            },
            spawnEdit({ commit }, { payload }) {
                commit('ITEM_GET', { result: payload.filter });
                commit('meta/CRUD_EDIT', undefined, { root: true });
            },
            spawnOpen({ commit }, { payload }) {
                commit('ITEM_GET', { result: payload.filter });
                commit('meta/CRUD_OPEN', undefined, { root: true });
            }
        };
    }
    _mutations() {
        return {
            DESCRIPTION_SET: async (state, value) => {
                state._description = {
                    ...value,
                    fields: await this._parseQuery(value.fields)
                };
                state.__description = value;
                state.item = Object.entries(value.fields || {})
                    .filter(([, value]) => typeof value.module === 'string' || value.type === 'object')
                    .reduce((a, [key, value]) => ({
                    ...a,
                    [key]: value.array ? [] : {}
                }), {});
                Object.entries(value.fields || {})
                    .filter(([, value]) => ['checkbox', 'radio'].includes(value.type))
                    .forEach(([key, value]) => {
                    state.item[key] = value.type === 'radio' ? '' : [];
                });
                state._clearItem = Object.assign({}, state.item);
            },
            CACHE_QUERY: (state, { module, result }) => {
                state._queryCache[module] = result;
            },
            LOADING_SWAP(state, value) {
                state.isLoading = typeof value === 'boolean' ? value : !state.isLoading;
            },
            OFFSET_UPDATE(state, offset) {
                state._offset = offset;
            },
            COUNT_UPDATE(state, { recordsCount, recordsTotal, offset, limit }) {
                if (recordsCount)
                    state.recordsCount = recordsCount;
                if (recordsTotal)
                    state.recordsTotal = recordsTotal;
                if (offset)
                    state._offset = offset;
                if (limit)
                    state._limit = limit;
            },
            ITEM_GET(state, { result }) {
                state.item = result;
            },
            ITEMS_GET(state, { result }) {
                state.items = result;
            },
            ITEM_INSERT(state, { result }) {
                const found = state.items.filter(({ _id }) => result._id === _id).length > 0;
                if (found) {
                    state.items = state.items.map((item) => ({
                        ...(item._id === result._id ? result : item)
                    }));
                    return;
                }
                state.item = result;
                state.items = [
                    result,
                    ...state.items,
                ];
            },
            // ITEM_MODIFY(state: any, { props }: MutationProps) {
            //   state.item = {
            //     ...state.item,
            //     ...props
            //   }
            // },
            ITEMS_MODIFY(state, { props: { what }, payload }) {
                const satisfiesFilter = (item) => Object.entries(payload.filter)
                    .every(([key, value]) => Array.isArray(value) ? value.includes(item[key]) : value === item[key]);
                state.items = state.items
                    .map((item) => ({
                    ...item,
                    ...(satisfiesFilter(item) ? what : {})
                }));
            },
            ITEM_REMOVE(state, { result }) {
                state.items = state.items.filter(({ _id }) => result._id !== _id);
            },
            ITEMS_REMOVE(state, { payload }) {
                state.items = state.items.filter(({ _id }) => !payload.filter?._id?.includes(_id));
            },
            ITEM_CLEAR(state) {
                state.item = Object.assign({}, state._clearItem);
            },
            ITEMS_CLEAR(state) {
                state._halt = true;
                state.items = [];
            },
            ITEM_SELECT(state, { item, value }) {
                const select = (item) => [...state.selected, Object.assign({}, item)];
                const unselect = (item) => state.selected.filter(({ _id }) => _id !== item._id);
                state.selected = value === false
                    ? unselect(item)
                    : (state.selected.some(({ _id }) => _id === item._id)
                        ? unselect(item) : select(item));
            },
            ITEMS_SELECT(state, { items, value }) {
                state.selected = value ? items.map(({ _id }) => ({ _id })) || [] : [];
            },
            FILTERS_CLEAR(state) {
                state._filters = {};
            }
        };
    }
}
exports.Module = Module;
//# sourceMappingURL=module.js.map