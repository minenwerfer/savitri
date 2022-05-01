"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaModule = void 0;
const module_1 = require("../module");
const variables_1 = __importDefault(require("variables"));
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
                title: '',
                body: '',
                image: '',
                component: '',
                details: {}
            },
            prompt: {
                isVisible: false,
                title: '',
                body: '',
                actions: [],
            },
            sidebar: {
                isVisible: false,
                title: '',
                component: ''
            },
            toast: {
                isVisible: false,
                text: '',
                itr: 0
            },
            report: {
                isVisible: false
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
            isInsertReadonly: (state) => state.crud.isInsertReadonly,
            isMenuVisible: (state) => state.menu.isVisible,
            isMobileMenuVisible: (state) => state.menu.isMobileVisible,
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
            describe: ({ commit }, modules) => new Promise(async (resolve) => {
                for (const module of modules) {
                    await this._http.get(`/${module}/describe`).then(({ data }) => {
                        commit('DESCRIPTIONS_ADD', data?.result);
                    });
                }
                resolve();
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
            },
            spawnSidebar: ({ commit }, payload) => {
                commit('SIDEBAR_SPAWN', payload);
            },
            closeSidebar: ({ commit }) => {
                commit('SIDEBAR_CLOSE');
            },
            spawnToast: ({ commit }, payload) => {
                commit('TOAST_SPAWN', payload);
            },
            closeToast: ({ commit }) => {
                commit('TOAST_CLOSE');
            },
            spawnReport: ({ commit }) => {
                commit('REPORT_SPAWN');
            },
            closeReport: ({ commit }) => {
                commit('REPORT_CLOSE');
            },
        };
    }
    mutations() {
        return {
            GLOBAL_LOADING_SWAP: (state, value) => {
                state.globalIsLoading = typeof value === 'boolean' ? value : !state.globalIsLoading;
            },
            VIEW_TITLE_SET: (state, value) => {
                const translated = window._i18n.global.tc(value || '', 2)
                    .capitalize()
                    .replace('%viewTitle%', '-');
                state.viewTitle = translated;
                document.title = `${variables_1.default.productName} | ${translated}`;
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
            MENU_SWAP: (state, value) => {
                if (Object.keys(value).length > 0) {
                    Object.assign(state.menu, value);
                    return;
                }
                state.menu.isVisible = !state.menu.isVisible;
                state.menu.isMobileVisible = !state.menu.isMobileVisible;
                localStorage.setItem('meta:menu:isVisible', state.menu.isVisible);
                localStorage.setItem('meta:menu:isMobileVisible', state.menu.isMobileVisible);
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
                    image: '',
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
            PROMPT_FULFILL: (_, option) => {
                window.dispatchEvent(new CustomEvent('__prompt', {
                    detail: { option }
                }));
            },
            SIDEBAR_SPAWN: (state, payload) => {
                Object.assign(state.sidebar, {
                    isVisible: true,
                    ...payload
                });
            },
            SIDEBAR_CLOSE: (state) => {
                Object.assign(state.sidebar, {
                    isVisible: false,
                });
            },
            TOAST_SPAWN: (state, payload) => {
                Object.assign(state.toast, {
                    isVisible: true,
                    itr: state.toast.itr + 1,
                    ...payload
                });
            },
            TOAST_CLOSE: (state) => {
                Object.assign(state.toast, {
                    isVisible: false
                });
            },
            REPORT_SPAWN: (state) => {
                state.report.isVisible = true;
            },
            REPORT_CLOSE: (state) => {
                state.report.isVisible = false;
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
            },
        };
    }
}
exports.MetaModule = MetaModule;
//# sourceMappingURL=meta.js.map