import 'common/polyfill';
import { createApp } from 'vue';
import { extendRouter } from './router';
import { extendStore } from './store';
import { useI18n } from './i18n';
import { instance as createStore } from './store';
import { instance as createRouter } from './router';
import { PersistentStorage } from './idb/singleton';
import { default as webpackVariables } from 'variables';
import 'frontend/assets/tailwind.css';
import 'frontend/assets/main.css';
export * from 'vue';
import Unicon from 'vue-unicons';
import * as Icons from 'vue-unicons/dist/icons';
export const useApp = (config) => new Promise((resolve) => {
    const { component, i18n, menuSchema, routerExtension, storeExtension } = config;
    const store = createStore();
    const router = createRouter(store);
    if (routerExtension) {
        extendRouter(router, routerExtension);
    }
    if (storeExtension) {
        extendStore(store, storeExtension);
    }
    const app = createApp(component);
    app.use(router);
    app.use(store);
    app.use(useI18n(i18n));
    app.provide('menuSchema', menuSchema);
    app.provide('i18n', i18n);
    app.provide('baseVersion', require('../../../package.json').version);
    // app.provide('productVersion', require(`./package.json`).version)
    Unicon.add([...Object.values(Icons)]);
    app.use(Unicon);
    app.mixin({
        provide: {
            ...webpackVariables
        }
    });
    Object.assign(window, {
        _router: router,
        _store: store,
    });
    // initializes storage singleton
    new PersistentStorage;
    PersistentStorage.instance.switchObjectStore('application');
    store.dispatch('meta/describeAll').then(() => {
        window.dispatchEvent(new CustomEvent('__storeCreated'));
        resolve({
            app,
            router,
            store
        });
    });
});
