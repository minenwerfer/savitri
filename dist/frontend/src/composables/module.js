"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const helpers_1 = require("common/helpers");
const entity_1 = require("common/entity");
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
    const _getIndexes = (key, form = false) => {
        return (0, entity_1.getIndexes)(store.state[name].__description, key, form);
    };
    const getFirstIndex = (key, form = false) => {
        const fields = _getIndexes(key, form);
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
        const { values } = (store.state[name]?.__description.fields || {})[key] || {};
        const query = (Array.isArray(values)
            ? values[0]
            : values)?.__query || {};
        const firstField = getFirstIndex(key, form);
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
            ? ((Array.isArray(value) || value?._id) ? getFirstValue(value, key, form) : Object.values(value)[0])
            : value;
        const formatted = firstValue !== undefined
            ? (field?.type === 'datetime' ? firstValue?.formatDateTime(field.includeHours) : firstValue)
            : '-';
        return typeof formatted === 'string' && formatted.length >= field?.trim && field && field.trim
            ? formatted.substr(0, field.trim - 3) + '...'
            : formatted;
    };
    const resumeItem = (item) => {
        return Object.entries(item || {})
            .reduce((a, [key, value]) => ({
            ...a,
            [key]: value && typeof value === 'object' && '_id' in value
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
        getIndexes: _getIndexes,
        getFirstIndex,
        getFirstValue,
        formatValue,
        resumeItem,
        resumedItem: (0, vue_1.computed)(() => resumeItem(store.getters[`${name}/item`])),
        resumedItems: (0, vue_1.computed)(() => store.getters[`${name}/items`]?.map((i) => resumeItem(i))),
        getItemIndex,
        setItem,
        ...getters.reduce((a, k) => ({
            ...a,
            [k]: (0, vue_1.computed)(() => store.getters[`${name}/${k}`])
        }), {}),
        ...props.reduce((a, k) => ({
            ...a,
            [k]: (0, vue_1.computed)(() => store.state[name][k])
        }), {}),
        ...actions.reduce((a, k) => ({
            ...a, [k]: (payload) => store.dispatch(`${name}/${k}`, payload)
        }), {})
    };
};
//# sourceMappingURL=module.js.map