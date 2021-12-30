"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crud = void 0;
/**
 * @exports @const
 * Crud UI operations (close modal, etc) via global action props.
 */
const crud = (store) => {
    store.subscribe((mutation) => {
        const payload = mutation.payload?.props || {};
        if (payload.__crudClose) {
            store.commit('meta/CRUD_CLOSE');
        }
    });
};
exports.crud = crud;
//# sourceMappingURL=crud.js.map