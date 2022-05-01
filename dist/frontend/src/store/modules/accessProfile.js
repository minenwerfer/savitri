"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessProfileModule = void 0;
const module_1 = require("../module");
class AccessProfileModule extends module_1.Module {
    constructor() {
        super('accessProfile', {}, {});
    }
    actions() {
        return {
            spawnAdd: ({ commit }) => {
                commit('ITEM_CLEAR');
                window._router.push({ name: 'dashboard-access-edit' });
            },
            spawnEdit: ({ commit }, { payload }) => {
                commit('ITEM_GET', { result: payload.filters });
                window._router.push({ name: 'dashboard-access-edit' });
            }
        };
    }
}
exports.AccessProfileModule = AccessProfileModule;
//# sourceMappingURL=accessProfile.js.map