"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessModule = void 0;
const module_1 = require("frontend/store/module");
class AccessModule extends module_1.Module {
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
exports.AccessModule = AccessModule;
//# sourceMappingURL=index.js.map