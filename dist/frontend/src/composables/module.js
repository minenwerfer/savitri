"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const helpers_1 = require("common/helpers");
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
];
const props = [
    'recordsCount',
    'recordsTotal',
    'isLoading',
    'selected'
];
const actions = [
    'get',
    'getAll',
    'insert',
    'deepInsert',
    'modify',
    'remove',
    'clear'
];
exports.default = (name, store) => {
    const useFields = (fields, except = false) => {
        return (0, helpers_1.fromEntries)(Object.entries(store.getters[`${name}/fields`])
            .filter(([key]) => except ? !fields.includes(key) : fields.includes(key)));
    };
    const useFieldsExcept = (fields) => useFields(fields, true);
    /**
     * @param {string} value
     * @param {string} key
     * @param {boolean} form - tells whether or not the value is being used in a form
     */
    const getIndexes = (value, key, form = false) => {
        const [_, reference] = Object.entries(store.state[name].__description.fields || {})
            .find(([k]) => key === k) || [,];
        const query = {};
        // retrieves index if dynamic querying is used
        if (reference?.values) {
            // values can be either arrays or objects
            const prop = Array.isArray(reference.values)
                ? reference.values.find((e) => Object.keys(e)[0] === '__query')?.__query
                : reference.values.__query;
            Object.assign(query, prop || {});
        }
        const { module, index, formIndex } = query.module ? query : (reference || {});
        if (!module) {
            return;
        }
        const field = (form ? (formIndex || index) : index) || Object.keys(store.getters[`${module}/description`].fields)[0];
        return Array.isArray(field) ? field : [field];
    };
    const getFirstIndex = (value, key, form = false) => {
        const fields = getIndexes(value, key, form);
        return (fields || [])[0];
    };
    /**
     * @param {string} value
     * @param {string} key
     * @param {boolean} form - tells whether or not the value is being used in a form
     */
    const getFirstValue = (value, key, form = false) => {
        if (!value) {
            return '-';
        }
        const { values } = store.state[name]?.__description.fields[key] || {};
        const query = (Array.isArray(values)
            ? values[0]
            : values)?.__query || {};
        const firstField = getFirstIndex(value, key, form);
        const source = query.module && !(Array.isArray(value) ? value[0]?._id : value._id)
            ? store.state[name]._queryCache[query.module].filter(({ _id }) => Array.isArray(value) ? value.includes(_id) : value._id === _id)
            : value;
        const extract = (v) => typeof v === 'object' || firstField
            ? v[firstField]
            : v;
        const firstValue = Array.isArray(source)
            ? source.map((v) => extract(v)).join(', ')
            : extract(source);
        return firstValue && typeof firstValue === 'object'
            ? getFirstValue(firstValue, firstField)
            : firstValue;
    };
    const formatValue = (value, key, form = false, field) => {
        const firstValue = value && typeof value === 'object'
            ? getFirstValue(value, key, form)
            : value;
        return firstValue !== undefined
            ? (field?.type === 'datetime' ? firstValue.formatDateTime() : firstValue)
            : '-';
    };
    const resumeItem = (item) => {
        return Object.entries(item || {})
            .reduce((a, [key, value]) => ({
            ...a,
            [key]: typeof value === 'object'
                ? getFirstValue(value, key)
                : value
        }), {});
    };
    const getItemIndex = (item, items) => {
        const _id = typeof item === 'object'
            ? item._id
            : item;
        return (items || store.getters[`${name}/items`])
            .sort((a, b) => a._id > b._id ? -1 : 1)
            .findIndex((i) => i._id === _id) + 1;
    };
    const setItem = (item) => {
        store.commit(`${name}/ITEM_GET`, { result: item });
    };
    return {
        useFields,
        useFieldsExcept,
        getIndexes,
        getFirstIndex,
        getFirstValue,
        formatValue,
        resumeItem,
        resumedItem: (0, vue_1.computed)(() => resumeItem(store.getters[`${name}/item`])),
        resumedItems: (0, vue_1.computed)(() => store.getters[`${name}/items`].map((i) => resumeItem(i))),
        getItemIndex,
        setItem,
        ...getters.reduce((a, k) => ({ ...a, [k]: (0, vue_1.computed)(() => store.getters[`${name}/${k}`]) }), {}),
        ...props.reduce((a, k) => ({ ...a, [k]: (0, vue_1.computed)(() => store.state[name][k]) }), {}),
        ...actions.reduce((a, k) => ({ ...a, [k]: (payload) => store.dispatch(`${name}/${k}`, payload) }), {})
    };
};
//# sourceMappingURL=module.js.map