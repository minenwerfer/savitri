"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaModule = void 0;
const module_1 = require("frontend/store/module");
/**
 * @exports @class
 * Meta module.
 */
class MetaModule extends module_1.Module {
    constructor() {
        super('meta', {
            globalIsLoading: false,
            globalDescriptions: [],
            viewTitle: '',
            menu: {
                isVisible: true,
                isMobileVisible: false,
            },
            modal: {
                isVisible: false,
                title: 'Teste',
                body: 'Lorem ipsum dolor sit amet',
                component: '',
                details: {}
            },
            prompt: {
                isVisible: false,
                title: 'Teste',
                body: 'Lorem ipsum dolor sit amet',
                actions: [],
            },
            crud: {
                isInsertVisible: false,
                isInsertReadonly: false
            }
        }, {});
    }
    getters() {
        return {
            isInsertVisible: (state) => state.crud.isInsertVisible,
            isInsertReadonly: (state) => state.crud.isInsertReadonly
        };
    }
    actions() {
        return {
            /**
             * @function
             * Fetchs all modules metadata from backend.
             * It may be accessed through _description.
             */
            describeAll: ({ commit }) => new Promise((resolve) => {
                commit('DESCRIPTIONS_CLEAR');
                this._http.get(this.route('describeAll')).then(({ data }) => {
                    Object.entries(data?.result).forEach(([, result]) => {
                        commit('DESCRIPTIONS_ADD', result);
                    });
                    resolve(data?.result);
                });
            }),
            setViewTitle: ({ commit }, value) => {
                commit('VIEW_TITLE_SET', value);
            },
            swapMenu: ({ commit }, value) => {
                commit('MENU_SWAP', value || {});
            },
            spawnModal: ({ commit }, payload) => new Promise((resolve) => {
                commit('MODAL_SPAWN', payload);
                const event = () => {
                    window.removeEventListener('__modal', event);
                    commit('MODAL_CLOSE');
                    resolve();
                };
                window.addEventListener('__modal', event);
            }),
            closeModal: ({ commit }) => {
                commit('MODAL_CLOSE');
            },
            spawnPrompt: ({ commit }, payload) => new Promise((resolve) => {
                commit('PROMPT_SPAWN', payload);
                const event = ({ detail }) => {
                    window.removeEventListener('__prompt', event);
                    commit('PROMPT_CLOSE');
                    resolve(detail.option);
                };
                window.addEventListener('__prompt', event);
            }),
            closePrompt: ({ commit }) => {
                commit('PROMPT_CLOSE');
            },
            fulfillPrompt: ({ commit }, option) => {
                commit('PROMPT_FULFILL', option);
            },
            closeCrud: ({ commit }) => {
                commit('CRUD_CLOSE');
            }
        };
    }
    mutations() {
        return {
            GLOBAL_LOADING_SWAP: (state, value) => {
                state.globalIsLoading = typeof value === 'boolean' ? value : !state.globalIsLoading;
            },
            VIEW_TITLE_SET: (state, value) => {
                state.viewTitle = value;
            },
            DESCRIPTIONS_ADD: (state, module) => {
                state.globalDescriptions = [
                    ...state.globalDescriptions,
                    module
                ];
            },
            DESCRIPTIONS_CLEAR: (state) => {
                state.globalDescriptions = [];
            },
            MENU_SWAP: (state, { desktop, mobile }) => {
                state.menu.isVisible = typeof desktop === 'boolean' ? desktop : !state.menu.isVisible;
                state.menu.isMobileVisible = typeof mobile === 'boolean' ? mobile : !state.menu.isMobileVisible;
            },
            MODAL_SPAWN: (state, payload) => {
                Object.assign(state.modal, {
                    isVisible: true,
                    ...payload
                });
            },
            MODAL_CLOSE: (state) => {
                Object.assign(state.modal, {
                    isVisible: false,
                    title: '',
                    body: '',
                    component: '',
                    details: {}
                });
                window.dispatchEvent(new CustomEvent('__modal'));
            },
            PROMPT_SPAWN: (state, payload) => {
                Object.assign(state.prompt, {
                    isVisible: true,
                    ...payload
                });
            },
            PROMPT_CLOSE: (state) => {
                Object.assign(state.prompt, {
                    isVisible: false,
                    title: '',
                    body: '',
                    actions: {}
                });
            },
            PROMPT_FULFILL: (state, option) => {
                window.dispatchEvent(new CustomEvent('__prompt', {
                    detail: { option }
                }));
            },
            CRUD_CLOSE: (state) => {
                state.crud.isInsertVisible = false;
            },
            CRUD_EDIT: (state) => {
                state.crud.isInsertVisible = true;
                state.crud.isInsertReadonly = false;
            },
            CRUD_OPEN: (state) => {
                state.crud.isInsertVisible = true;
                state.crud.isInsertReadonly = true;
            }
        };
    }
}
exports.MetaModule = MetaModule;
