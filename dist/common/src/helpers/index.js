"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromEntries = exports.flatten = void 0;
/**
 * @exports @function
 * Takes a multi depth object and flattens it.
 */
function flatten(obj = {}, acc, res = {}) {
    if (Array.isArray(obj)) {
        return obj.map((e) => flatten(e));
    }
    Object.entries(obj).forEach(([key, value]) => {
        const flat = acc ? `${acc}.${key}` : key;
        if (typeof value === 'object' && !Array.isArray(value)) {
            return flatten(value, flat, res);
        }
        res[flat] = value;
    });
    return res;
}
exports.flatten = flatten;
/**
 * @exports @function
 * Transforms Object.entries() return value back into an object.
 */
function fromEntries(entries) {
    return entries
        .reduce((a, [key, value]) => ({ ...a, [key]: value }), {});
}
exports.fromEntries = fromEntries;
//# sourceMappingURL=index.js.map