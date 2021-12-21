import { Module } from 'frontend/store/module';
export class AccessModule extends Module {
    constructor() {
        super('access', {}, {});
    }
    actions() {
        return {
            spawnAdd: ({ commit }) => {
                commit('ITEM_CLEAR');
                window._router.push({ name: 'dashboard-access-edit' });
            },
            spawnEdit: ({ commit }, { payload }) => {
                commit('ITEM_GET', { result: payload.filter });
                window._router.push({ name: 'dashboard-access-edit' });
            }
        };
    }
}
