import { computed } from 'vue';
import { fromEntries } from 'common/helpers';
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
export default (name, store) => {
    const useFields = (fields, except = false) => {
        return fromEntries(Object.entries(store.getters[`${name}/fields`])
            .filter(([key]) => except ? !fields.includes(key) : fields.includes(key)));
    };
    const useFieldsExcept = (fields) => useFields(fields, true);
    const getFirstField = (value, key, form = false) => {
        const reference = Object.entries(store.getters[`${name}/fields`] || {})
            .find(([k]) => key === k) || [,];
        const { module, index, formIndex } = reference[1] || {};
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
        const firstValue = Array.isArray(value)
            ? value.map((v) => v[firstField]).join(', ')
            : value[firstField];
        return firstValue && typeof firstValue === 'object'
            ? getFirstValue(firstValue, firstField)
            : firstValue;
    };
    const formatValue = (value, key, form = false) => {
        const firstValue = value && typeof value === 'object'
            ? getFirstValue(value, key, form)
            : value;
        return firstValue || '-';
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
    const insert = (payload) => store.dispatch(`${name}/insert`, payload);
    const deepInsert = (payload) => store.dispatch(`${name}/deepInsert`, payload);
    return {
        insert,
        deepInsert,
        useFields,
        useFieldsExcept,
        getFirstField,
        getFirstValue,
        formatValue,
        resumedItem: computed(() => resumedItem(store.getters[`${name}/item`])),
        resumedItems: computed(() => store.getters[`${name}/items`].map((i) => resumedItem(i))),
        ...getters.reduce((a, k) => ({ ...a, [k]: computed(() => store.getters[`${name}/${k}`]) }), {}),
        ...props.reduce((a, k) => ({ ...a, [k]: computed(() => store.state[name][k]) }), {})
    };
};
