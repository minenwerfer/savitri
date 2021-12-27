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
    'individualActions'
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
    'remove',
    'clear'
];
exports.default = (name, store) => {
    const useFields = (fields, except = false) => {
        return (0, helpers_1.fromEntries)(Object.entries(store.getters[`${name}/fields`])
            .filter(([key]) => except ? !fields.includes(key) : fields.includes(key)));
    };
    const useFieldsExcept = (fields) => useFields(fields, true);
    const getFirstField = (value, key, form = false) => {
        const reference = Object.entries(store.state[name].__description.fields || {})
            .find(([k]) => key === k) || [,];
        const query = {};
        // retrieves index if dynamic querying is used
        if (reference[1]?.values) {
            Object.assign(query, reference[1].values.find((e) => Object.keys(e)[0] === '__query').__query);
        }
        const { module, index, formIndex } = query || (reference[1] || {});
        if (!module) {
            return;
        }
        return (form ? (formIndex || index) : index) || Object.keys(store.getters[`${module}/description`].fields)[0];
    };
    const getFirstValue = (value, key, form = false) => {
        if (!value) {
            return '-';
        }
        const firstField = getFirstField(value, key, form);
        const extract = (value) => typeof value === 'object'
            ? value[firstField]
            : value;
        const firstValue = Array.isArray(value)
            ? value.map((v) => extract(v)).join(', ')
            : extract(value);
        return firstValue && typeof firstValue === 'object'
            ? getFirstValue(firstValue, firstField)
            : firstValue;
    };
    const formatValue = (value, key, form = false) => {
        const firstValue = value && typeof value === 'object'
            ? getFirstValue(value, key, form)
            : value;
        return firstValue !== undefined
            ? firstValue
            : '-';
    };
    const resumedItem = (item) => {
        return Object.entries(item)
            .reduce((a, [key, value]) => ({
            ...a,
            [key]: typeof value === 'object'
                ? getFirstValue(value, key)
                : value
        }), {});
    };
    return {
        useFields,
        useFieldsExcept,
        getFirstField,
        getFirstValue,
        formatValue,
        resumedItem: (0, vue_1.computed)(() => resumedItem(store.getters[`${name}/item`])),
        resumedItems: (0, vue_1.computed)(() => store.getters[`${name}/items`].map((i) => resumedItem(i))),
        ...getters.reduce((a, k) => ({ ...a, [k]: (0, vue_1.computed)(() => store.getters[`${name}/${k}`]) }), {}),
        ...props.reduce((a, k) => ({ ...a, [k]: (0, vue_1.computed)(() => store.state[name][k]) }), {}),
        ...actions.reduce((a, k) => ({ ...a, [k]: (payload) => store.dispatch(`${name}/${k}`, payload) }), {})
    };
};
