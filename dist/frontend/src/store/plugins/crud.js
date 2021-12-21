/**
 * @exports @const
 * Crud UI operations (close modal, etc) via global action props.
 */
export const crud = (store) => {
    store.subscribe((mutation) => {
        const payload = mutation.payload?.props || {};
        if (payload.__crudClose) {
            store.commit('meta/CRUD_CLOSE');
        }
    });
};
