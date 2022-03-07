"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexes = void 0;
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
//# sourceMappingURL=index.js.map