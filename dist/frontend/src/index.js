"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApp = void 0;
require("common/polyfill");
const vue_1 = require("vue");
const router_1 = require("./router");
const store_1 = require("./store");
const i18n_1 = require("./i18n");
const store_2 = require("./store");
const router_2 = require("./router");
const singleton_1 = require("./idb/singleton");
const variables_1 = __importDefault(require("variables"));
require("frontend/../assets/tailwind.css");
require("frontend/../assets/main.css");
__exportStar(require("vue"), exports);
const vue_unicons_1 = __importDefault(require("vue-unicons"));
const Icons = __importStar(require("vue-unicons/dist/icons"));
const useApp = (config) => new Promise((resolve) => {
    const { component, i18n, menuSchema, routerExtension, storeExtension } = config;
    const store = (0, store_2.instance)();
    const router = (0, router_2.instance)(store);
    if (routerExtension) {
        (0, router_1.extendRouter)(router, routerExtension);
    }
    if (storeExtension) {
        (0, store_1.extendStore)(store, storeExtension);
    }
    const app = (0, vue_1.createApp)(component);
    app.use(router);
    app.use(store);
    app.use((0, i18n_1.useI18n)(i18n));
    app.provide('menuSchema', menuSchema);
    app.provide('i18n', i18n);
    app.provide('baseVersion', require('../../../package.json').version);
    // app.provide('productVersion', require(`./package.json`).version)
    vue_unicons_1.default.add([...Object.values(Icons)]);
    app.use(vue_unicons_1.default);
    app.mixin({
        provide: {
            ...variables_1.default
        }
    });
    Object.assign(window, {
        _router: router,
        _store: store,
    });
    // initializes storage singleton
    const persistentStorage = new singleton_1.PersistentStorage();
    singleton_1.PersistentStorage.instance.switchObjectStore('application');
    // precaches assets
    if (variables_1.default.productLogo) {
        const productLogo = new Image();
        productLogo.src = require(`@/../assets/${variables_1.default.productLogo}`).default;
    }
    store.dispatch('meta/describeAll').then(() => {
        window.dispatchEvent(new CustomEvent('__storeCreated'));
    });
    resolve({
        app,
        router,
        store
    });
});
exports.useApp = useApp;
//# sourceMappingURL=index.js.map