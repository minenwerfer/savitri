import { Module } from 'frontend/store/module';
/**
 * @exports @const
 * Automatically registers modules.
 */
export const autoModules = (store) => {
    store.subscribe(async (mutation, state) => {
        const { type, payload } = mutation;
        if (type === 'meta/DESCRIPTIONS_ADD') {
            if (store.hasModule(payload.module)) {
                store.commit(`${payload.module}/DESCRIPTION_SET`, payload, { root: true });
                return;
            }
            const Impl = class extends Module {
                constructor(route, meta, item) {
                    super(route, meta, item);
                }
            };
            store.registerModule(payload.module, new Impl(payload.module, {}, {}).module);
            store.commit(`${payload.module}/DESCRIPTION_SET`, payload, { root: true });
        }
    });
};
