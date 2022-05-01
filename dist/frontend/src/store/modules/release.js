"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseModule = void 0;
const module_1 = require("../module");
class ReleaseModule extends module_1.Module {
    constructor() {
        super('release', {}, {});
    }
    mutations() {
        return {
            ITEMS_GET: (state, { result }) => {
                Object.assign(state.item, result);
            }
        };
    }
}
exports.ReleaseModule = ReleaseModule;
//# sourceMappingURL=release.js.map