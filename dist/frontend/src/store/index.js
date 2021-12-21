import { createStore, createLogger } from 'vuex';
import { autoModules, crud } from './plugins';
import { MetaModule } from './modules/meta';
import { UserModule } from './modules/user';
import { AccessModule } from './modules/access';
export const instance = () => {
    return createStore({
        modules: {
            meta: new MetaModule().module,
            user: new UserModule().module,
            access: new AccessModule().module
        },
        plugins: [
            autoModules,
            crud,
            ...(process.env.NODE_ENV === 'development' ? [createLogger()] : [])
        ],
        strict: process.env.NODE_ENV === 'production'
    });
};
export const extendStore = (store, storeExtension) => {
    Object.entries(storeExtension)
        .forEach(([name, module]) => store.registerModule(name, module));
};
