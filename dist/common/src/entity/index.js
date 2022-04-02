"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemIndex = exports.resumeItem = exports.formatValue = exports.getFirstValue = exports.getFirstIndex = exports.getIndexes = void 0;
/**
 * @remarks frontend only (vuex)
 */
const _store = globalThis._store;
const getIndexes = (description, key, form = false) => {
    const [_, reference] = Object.entries(description.fields || {})
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
    const field = (form ? (formIndex || index) : index) || Object.keys(description.fields)[0];
    return Array.isArray(field) ? field : [field];
};
exports.getIndexes = getIndexes;
const getFirstIndex = (description, key, form = false) => {
    const fields = (0, exports.getIndexes)(description, key, form);
    return (fields || [])[0];
};
exports.getFirstIndex = getFirstIndex;
/**
 * @param {string} value
 * @param {string} key
 * @param {boolean} form - tells whether or not the value is being used in a form
 */
const getFirstValue = (description, value, key, form = false, name) => {
    if (!value) {
        return '-';
    }
    const { values } = (description || {})[key] || {};
    const query = (Array.isArray(values)
        ? values[0]
        : values)?.__query || {};
    const firstField = (0, exports.getFirstIndex)(description, key, form);
    const source = _store && name && query.module && !(Array.isArray(value) ? value[0]?._id : value._id)
        ? _store.state[name]._queryCache[query.module].filter(({ _id }) => Array.isArray(value) ? value.includes(_id) : value._id === _id)
        : value;
    const extract = (v) => typeof v === 'object' || firstField
        ? v[firstField]
        : v;
    const firstValue = Array.isArray(source)
        ? source.map((v) => extract(v)).join(', ')
        : extract(source);
    return firstValue && typeof firstValue === 'object'
        ? (0, exports.getFirstValue)(description, firstValue, firstField, form, name)
        : firstValue;
};
exports.getFirstValue = getFirstValue;
const formatValue = (description, value, key, form = false, field) => {
    const firstValue = value && typeof value === 'object'
        ? ((Array.isArray(value) || value?._id) ? (0, exports.getFirstValue)(description, value, key, form) : Object.values(value)[0])
        : value;
    const formatted = firstValue !== undefined
        ? (field?.type === 'datetime' ? firstValue?.formatDateTime(field.includeHours) : firstValue)
        : '-';
    return !form && typeof formatted === 'string' && formatted.length >= field?.trim && field && field.trim
        ? formatted.substr(0, field.trim - 3) + '...'
        : String(formatted || '-');
};
exports.formatValue = formatValue;
const resumeItem = (description, item) => {
    return Object.entries(item || {})
        .reduce((a, [key, value]) => ({
        ...a,
        [key]: value && typeof value === 'object' && '_id' in value
            ? (0, exports.getFirstValue)(description, value, key)
            : value
    }), {});
};
exports.resumeItem = resumeItem;
const getItemIndex = (item, items, name) => {
    const _id = typeof item === 'object'
        ? item._id
        : item;
    return ((items || _store?.getters[`${name}/items`]) || [])
        .sort((a, b) => a._id > b._id ? -1 : 1)
        .findIndex((i) => i._id === _id) + 1;
};
exports.getItemIndex = getItemIndex;
//# sourceMappingURL=index.js.map