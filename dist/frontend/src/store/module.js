"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = exports.normalizeFilters = exports.SV_API_URL_2 = exports.SV_API_URL = void 0;
const http_1 = require("common/http");
const helpers_1 = require("common/helpers");
const variables_1 = __importDefault(require("variables"));
exports.SV_API_URL = process.env.NODE_ENV === 'development'
    ? 'http://0.0.0.0:3000/api'
    : '/api';
exports.SV_API_URL_2 = process.env.NODE_ENV === 'development'
    ? 'http://0.0.0.0:3001/api'
    : '/api2';
const normalizeFilters = (filters) => {
    return filters
        .reduce((a, b) => {
        const filter = typeof b !== 'string'
            ? { [b.field]: b.default || '' }
            : { [b]: '' };
        return {
            ...a,
            ...filter
        };
    }, {});
};
exports.normalizeFilters = normalizeFilters;
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
    _description;
    namespaced = true;
    /**
     * @constructor
     * Creates a proxy whose function is to merge common props with the child's ones.
     *
     * @param {string} route - API route
     * @param {object} initialState - initial state
     * @param {object} initialItemState - initial item state
     * @param {string} apiUrl - URL to be used in place of SV_API_URL
     */
    constructor(route, initialState, initialItemState, description, apiUrl) {
        this._initialState = initialState;
        this._initialItemState = initialItemState;
        this._description = description;
        if (description?.filters) {
            this._commonState._filters = (0, exports.normalizeFilters)(description.filters);
        }
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
            baseURL: apiUrl || exports.SV_API_URL,
        });
        /**
         * @function
         * Catchs errors then spawns a modal.
         */
        const _httpMethodWrapper = (target, method, ctx, ...args) => new Promise((resolve, reject) => {
            const call = method.apply(target, ...args);
            if (!(call instanceof Promise)) {
                return call;
            }
            return call
                .then(resolve)
                .catch(async (error) => {
                if (error === 'signed out') {
                    ctx.dispatch('user/signout', {}, { root: true });
                    await ctx.dispatch('meta/spawnModal', {
                        title: 'Sua sessão expirou',
                        body: 'Você será redirecionado para a página de login.',
                        image: !variables_1.default.strict
                            ? 'http://3.bp.blogspot.com/-vu0LFEac67Y/TbIWEtl9VgI/AAAAAAAAADg/WnBZ_bVkXJs/s1600/foreveralone.gif'
                            : undefined
                    }, { root: true });
                    window._router.push({ name: 'signin' });
                }
                else {
                    ctx.commit('meta/MODAL_SPAWN', {
                        title: 'Erro',
                        body: error
                    }, { root: true });
                }
                console.trace(error);
                reject(error);
            });
        });
        this._proxiedHttp = new Proxy(this._http, {
            get: (target, key) => {
                const method = target[key];
                return ['request', 'get', 'post'].includes(key)
                    ? (ctx, ...args) => _httpMethodWrapper(target, method, ctx, [...args])
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
            this.http.post({ commit, dispatch }, route, { ...payload, ...props })
                .then((response) => {
                const data = response?.data || {};
                if (state._halt) {
                    return reject('operation halted');
                }
                const result = data.result || data;
                if (mutation) {
                    commit(mutation, { result, payload, props });
                }
                if (typeof data.recordsCount === 'number' || typeof data.recordsTotal === 'number') {
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
        const normalize = (data, value) => data
            .reduce((a, item) => ({
            ...a,
            [item._id]: item[value.index]
        }), {});
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
                throw new Error('dynamic query but no module is specified');
            }
            const stored = (window._queryCache || {})[value.module];
            if (stored && Object.keys(stored).length > 0) {
                return normalize(stored, value);
            }
            /**
             * @remarks This empty entry will prevent duplicate requests.
             */
            window._queryCache = {
                ...(window._queryCache || {}),
                [value.module]: {}
            };
            /**
             * @remarks optimization
             */
            if (!sessionStorage.getItem('auth:token') && !value.public) {
                return {};
            }
            const route = `${value.module}/getAll`;
            const filters = value.filters || {};
            const { data } = await this._http.post(route, filters);
            const result = normalize(data.result, value);
            window.dispatchEvent(new CustomEvent('__updateQueryCache', {
                detail: {
                    parentModule: this._route,
                    module: value.module,
                    result: data.result
                }
            }));
            return result;
        };
        const entries = Array.isArray(obj)
            ? obj.map((i) => Object.entries(i)[0])
            : Object.entries(obj);
        const result = array ? [] : {};
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
    _condenseItem(item) {
        return Object.entries(item || {})
            .reduce((a, [key, value]) => ({
            ...a,
            [key]: value && typeof value === 'object' && '_id' in value ? { _id: value._id } : value
        }), {});
    }
    _removeEmpty(item) {
        const entries = Object.entries(item)
            .filter(([_, value]) => value && !(typeof value === 'string' && value.length === 0));
        return (0, helpers_1.fromEntries)(entries);
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
            queryCache: (state) => state._queryCache,
            item: (state) => {
                const merge = Object.entries(state._clearItem)
                    .reduce((a, [key, value]) => ({
                    ...a,
                    [key]: state.item[key] || value
                }), {});
                return Object.assign(Object.assign({}, state.item), merge);
            },
            condensedItem: (state) => this._condenseItem(state.item),
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
            filters: (state) => {
                const filters = this._removeEmpty(state._filters);
                const expr = (key, value) => {
                    const field = (this._description || state._description).fields[key];
                    // TODO: debug this
                    if (!field) {
                        return;
                    }
                    if (field.type === 'text') {
                        return {
                            $regex: value,
                            $options: 'i'
                        };
                    }
                    const values = Array.isArray(field.values) ? field.values[0] : field.values;
                    const query = values?.__query;
                    if (query?.module) {
                        return { _id: value };
                    }
                    return value;
                };
                const entries = Object.entries(filters)
                    .filter(([_, value]) => value && !(typeof value === 'string' && value.length === 0))
                    .map(([key, value]) => [key, expr(key, value)]);
                return this._condenseItem((0, helpers_1.fromEntries)(entries));
            },
            availableFilters: (state) => {
                if (!state._description?.filters) {
                    return {};
                }
                const fields = this._getters().fields(state);
                return Object.keys((0, exports.normalizeFilters)(state._description.filters))
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
                        type: ![undefined].includes(value.type)
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
            remove: this._actionHelper('remove', 'ITEM_REMOVE', (payload) => ({ ...payload, filters: { _id: payload.filters._id } })),
            removeAll: this._actionHelper('removeAll', 'ITEMS_REMOVE'),
            modify: this._actionHelper('modify', 'ITEM_MODIFY'),
            modifyAll: this._actionHelper('modifyAll', 'ITEMS_MODIFY'),
            deepInsert: ({ dispatch, getters, rootGetters }, payload) => new Promise(async (resolve) => {
                const { expandedSubmodules } = getters;
                for (const [k, { module }] of expandedSubmodules) {
                    if (payload.what[k] && typeof payload.what[k] === 'object' && Object.keys(payload.what[k]).length > 0) {
                        payload.what[k] = await dispatch(`${module}/insert`, { what: payload.what[k] }, { root: true });
                    }
                }
                const result = await dispatch('insert', payload);
                resolve(result);
            }),
            activate: ({ dispatch }, payload) => dispatch('insert', { ...payload, what: { active: true } }),
            activateAll: ({ dispatch }, payload) => dispatch('modifyAll', { ...payload, what: { active: true } }),
            deactivate: ({ dispatch }, payload) => dispatch('insert', { ...payload, what: { active: false } }),
            deactivateAll: ({ dispatch }, payload) => dispatch('modifyAll', { ...payload, what: { active: false } }),
            update: (...args) => {
                const func = this._actionHelper('update');
                const [{ commit, dispatch }] = args;
                return func.apply(this, args)
                    .then((response) => {
                    commit('ITEMS_CLEAR');
                    dispatch('getAll');
                    dispatch('meta/spawnModal', {
                        title: 'Registros atualizados',
                        body: `Resposta do servidor: ${response}`
                    }, { root: true });
                });
            },
            ask: ({ dispatch }, { action, params, title, body }) => new Promise((resolve, reject) => dispatch('meta/spawnPrompt', {
                title: title || 'Diálogo de confirmação',
                body: body || `Confirmar ação?`,
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
            selectAll: ({ commit, getters }, value = true) => commit('ITEMS_SELECT', { items: getters.items, value }),
            // will getAll starting from the given offset
            paginate: ({ commit, dispatch, state, getters }, { page, limit }) => new Promise((resolve) => {
                const prevOffset = state._offset || 0;
                const newOffset = ['undefined', 'number'].includes(typeof page)
                    ? page || prevOffset
                    : (typeof page === 'string' && /^(\+|-)[0-9]+$/.test(page) ? eval(`${prevOffset}${page}`) : 0);
                return dispatch('getAll', {
                    offset: (newOffset - 1) * state._limit,
                    filters: getters.filters,
                    limit
                })
                    .then((res) => {
                    commit('OFFSET_UPDATE', res.page || page);
                    commit('LIMIT_UPDATE', limit);
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
                commit('ITEM_GET', { result: Object.assign({}, payload.filters) });
                commit('meta/CRUD_EDIT', undefined, { root: true });
            },
            spawnOpen({ commit }, { payload }) {
                commit('ITEM_GET', { result: payload.filters });
                commit('meta/CRUD_OPEN', undefined, { root: true });
            }
        };
    }
    _mutations() {
        return {
            DESCRIPTION_SET: async (state, payload) => {
                state._description = {
                    ...payload,
                    fields: await this._parseQuery(payload.fields, false)
                };
                state.__description = payload;
                state.item = Object.entries(payload.fields || {})
                    .filter(([, value]) => typeof value.module === 'string' || value.type === 'object')
                    .reduce((a, [key, value]) => ({
                    ...a,
                    [key]: value.array ? [] : {}
                }), {});
                Object.entries(payload.fields || {})
                    .filter(([, value]) => ['checkbox', 'radio'].includes(value.type))
                    .forEach(([key, value]) => {
                    state.item[key] = value.type === 'radio' ? '' : [];
                });
                state._clearItem = Object.assign({}, state.item);
            },
            CACHE_QUERY: (state, { module, result }) => {
                state._queryCache[module] = result;
                window._queryCache = {
                    ...(window._queryCache || {}),
                    [module]: result
                };
            },
            LOADING_SWAP: (state, value) => {
                state.isLoading = typeof value === 'boolean' ? value : !state.isLoading;
            },
            OFFSET_UPDATE: (state, offset) => {
                state._offset = offset;
            },
            LIMIT_UPDATE: (state, limit) => {
                state._limit = limit;
            },
            COUNT_UPDATE: (state, { recordsCount, recordsTotal, offset, limit }) => {
                if (recordsCount)
                    state.recordsCount = recordsCount;
                if (recordsTotal)
                    state.recordsTotal = recordsTotal;
                if (offset)
                    state._offset = offset;
                if (limit)
                    state._limit = limit;
            },
            ITEM_GET: (state, { result }) => {
                state.item = result;
            },
            ITEMS_GET: (state, { result }) => {
                state.items = result;
            },
            ITEM_INSERT: (state, { result }) => {
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
            ITEM_MODIFY: (state, { props }) => {
                state.item = {
                    ...state.item,
                    ...props
                };
            },
            ITEMS_MODIFY: (state, { props: { what }, payload }) => {
                const satisfiesFilter = (item) => Object.entries(payload.filters)
                    .every(([key, value]) => Array.isArray(value) ? value.includes(item[key]) : value === item[key]);
                state.items = state.items
                    .map((item) => ({
                    ...item,
                    ...(satisfiesFilter(item) ? what : {})
                }));
            },
            ITEM_REMOVE: (state, { result }) => {
                state.items = state.items.filter(({ _id }) => result._id !== _id);
            },
            ITEMS_REMOVE: (state, { payload }) => {
                state.items = state.items.filter(({ _id }) => !payload.filters?._id?.includes(_id));
            },
            ITEM_CLEAR: (state) => {
                state.item = Object.assign({}, state._clearItem);
            },
            ITEMS_CLEAR: (state) => {
                state._halt = true;
                state.items = [];
            },
            ITEM_SELECT: (state, { item, value }) => {
                const select = (i) => [...state.selected, Object.assign({}, i)];
                const unselect = (i) => state.selected.filter(({ _id }) => _id !== i._id);
                state.selected = value === false
                    ? unselect(item)
                    : (state.selected.some(({ _id }) => _id === item._id)
                        ? unselect(item) : select(item));
            },
            ITEMS_SELECT: (state, { items, value }) => {
                state.selected = value ? items.map(({ _id }) => ({ _id })) || [] : [];
            },
            FILTERS_CLEAR: (state) => {
                state._filters = (0, exports.normalizeFilters)(this._description?.filters || []);
            },
        };
    }
}
exports.Module = Module;
//# sourceMappingURL=module.js.map