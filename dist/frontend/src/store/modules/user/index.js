"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = exports.initialItemState = exports.initialState = void 0;
const module_1 = require("frontend/store/module");
/**
 * @exports @const
 * Initial state.
 */
exports.initialState = {
    current: {
        email: '',
        token: '',
        level: [],
    }
};
/**
 * @exports @const
 * Initial item state.
 */
exports.initialItemState = {
    email: '',
    verification: '',
};
/**
 * @exports @class
 * User module.
 */
class UserModule extends module_1.Module {
    constructor() {
        super('user', exports.initialState, exports.initialItemState);
    }
    actions() {
        return {
            authenticate: ({ commit, dispatch, state: { current } }) => new Promise((resolve) => {
                const payload = {
                    email: current.email,
                    password: current.password,
                };
                dispatch('swapLoading', true);
                this.http.post({ commit, dispatch }, this.route('authenticate'), payload)
                    .then(async ({ data: { result } }) => {
                    commit('USER_AUTH', result);
                    commit('ITEM_CLEAR');
                    await dispatch('meta/describeAll', {}, { root: true });
                    window.dispatchEvent(new CustomEvent('__storeCreated'));
                    resolve();
                })
                    .finally(() => dispatch('swapLoading', false));
            }),
            signout: ({ commit }) => new Promise((resolve) => {
                commit('USER_SIGNOUT');
                resolve();
            }),
            spawnChangePwd: ({ commit }, { payload: { filters } }) => {
                commit('ITEM_GET', { result: filters });
                window._router.push({ name: 'dashboard-user-changepass' });
            }
        };
    }
    getters() {
        return {
            token: (state) => state.current.token,
            current: () => JSON.parse(sessionStorage.getItem('auth:current') || '{}'),
        };
    }
    mutations() {
        return {
            USER_AUTH(state, value) {
                Object.assign(state.current, {
                    ...value,
                    password: ''
                });
                sessionStorage.setItem('auth:token', value.token);
                sessionStorage.setItem('auth:current', JSON.stringify(value));
            },
            CURRENT_UPDATE(state) {
                const value = JSON.parse(sessionStorage.getItem('auth:current') || '{}');
                Object.assign(state.current, value);
                sessionStorage.setItem('auth:current', JSON.stringify(value));
            },
            USER_SIGNOUT(state) {
                state.current = {};
                sessionStorage.removeItem('auth:token');
            }
        };
    }
}
exports.UserModule = UserModule;
//# sourceMappingURL=index.js.map