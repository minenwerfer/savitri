"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendStore = exports.instance = void 0;
const vuex_1 = require("vuex");
const plugins_1 = require("./plugins");
const meta_1 = require("./modules/meta");
const user_1 = require("./modules/user");
const access_1 = require("./modules/access");
const file_1 = require("./modules/file");
const instance = () => {
    const store = (0, vuex_1.createStore)({
        modules: {
            meta: new meta_1.MetaModule().module,
            user: new user_1.UserModule().module,
            access: new access_1.AccessModule().module,
            file: new file_1.FileModule().module
        },
        plugins: [
            plugins_1.autoModules,
            plugins_1.crud,
            ...(process.env.NODE_ENV === 'development' ? [(0, vuex_1.createLogger)()] : [])
        ],
        strict: process.env.NODE_ENV === 'production'
    });
    const evt = window.addEventListener('__updateQueryCache', ({ detail }) => {
        store.commit(`${detail.parentModule}/CACHE_QUERY`, {
            module: detail.module,
            result: detail.result
        });
    });
    return store;
};
exports.instance = instance;
const extendStore = (store, storeExtension) => {
    Object.entries(storeExtension)
        .forEach(([name, module]) => store.registerModule(name, module));
};
exports.extendStore = extendStore;
//# sourceMappingURL=index.js.map