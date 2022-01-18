"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoModules = void 0;
const module_1 = require("frontend/store/module");
/**
 * @exports @const
 * Automatically registers modules.
 */
const autoModules = (store) => {
    store.subscribe(async (mutation, state) => {
        const { type, payload } = mutation;
        if (type === 'meta/DESCRIPTIONS_ADD') {
            if (store.hasModule(payload.module)) {
                store.commit(`${payload.module}/DESCRIPTION_SET`, payload, { root: true });
                return;
            }
            const Impl = class extends module_1.Module {
                constructor(route, meta, item) {
                    super(route, meta, item, payload);
                }
            };
            store.registerModule(payload.module, new Impl(payload.module, {}, {}).module);
            store.commit(`${payload.module}/DESCRIPTION_SET`, payload, { root: true });
        }
    });
};
exports.autoModules = autoModules;
//# sourceMappingURL=autoModules.js.map