"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCache = void 0;
/**
 * @exports @const
 * Caches dynamic queries (__query) for further usage.
 */
const queryCache = (store) => {
    store.subscribe((mutation) => {
        const { type, payload } = mutation;
        if (/DESCRIPTION_SET$/.test(type)) {
            console.log({ mutation });
        }
    });
};
exports.queryCache = queryCache;
//# sourceMappingURL=queryCache.js.map