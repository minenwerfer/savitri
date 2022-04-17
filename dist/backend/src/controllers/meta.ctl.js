"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaControllerAbs = void 0;
const Controller_1 = require("./abstract/Controller");
const entity_1 = require("../entity");
class MetaControllerAbs extends Controller_1.Controller {
    _describeAll() {
        return {};
    }
    describeAll() {
        const descriptions = this._describeAll();
        Object.keys(descriptions).forEach((key) => {
            const description = descriptions[key];
            description.presets?.forEach((name) => {
                (0, entity_1.applyPreset)(description, name);
            });
        });
        return descriptions;
    }
}
exports.MetaControllerAbs = MetaControllerAbs;
//# sourceMappingURL=meta.ctl.js.map