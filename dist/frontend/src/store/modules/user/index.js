import { Module } from 'frontend/store/module';
/**
 * @exports @const
 * Initial state.
 */
export const initialState = {
    current: {
        email: '',
        password: '',
        token: '',
        level: [],
    }
};
/**
 * @exports @const
 * Initial item state.
 */
export const initialItemState = {
    email: '',
    password: ''
};
/**
 * @exports @class
 * User module.
 */
export class UserModule extends Module {
    constructor() {
        super('user', initialState, initialItemState);
    }
    actions() {
        return {
            authenticate: ({ commit, dispatch, state: { current } }) => new Promise((resolve) => {
                const payload = {
                    email: current.email,
                    password: current.password,
                };
                dispatch('swapLoading', true);
                this.http.post(commit, this.route('authenticate'), payload)
                    .then(async ({ data: { result } }) => {
                    commit('USER_AUTH', result);
                    commit('ITEM_CLEAR');
                    await dispatch('meta/describeAll', {}, { root: true });
                    window.dispatchEvent(new CustomEvent('__storeCreated'));
                    resolve();
                })
                    .finally(() => dispatch('swapLoading', false));
            })
        };
    }
    getters() {
        return {
            token: (state) => state.current.token,
        };
    }
    mutations() {
        return {
            USER_AUTH(state, value) {
                Object.assign(state.current, { email: '', password: '' });
                Object.assign(state.current, value);
                sessionStorage.setItem('auth:token', value.token);
            }
        };
    }
}
