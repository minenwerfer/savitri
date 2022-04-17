"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaController = void 0;
const controller_1 = require("../../controller");
const entity_1 = require("../../entity");
const { readdirSync, existsSync } = require('fs');
class MetaController extends controller_1.Controller {
    constructor() {
        super({
            publicMethods: ['describeAll'],
            description: {
                module: 'meta'
            }
        });
    }
    _getDescriptions() {
        const entities = [`${__dirname}/..`, `${process.cwd()}/entities`]
            .reduce((a, dir) => ({
            ...a,
            ...readdirSync(dir)
                .filter((d) => existsSync(`${dir}/${d}/index.json`))
                .reduce((a, d) => ({
                ...a,
                [d]: require(`${dir}/${d}/index.json`)
            }), {})
        }), {});
        return entities;
    }
    describeAll() {
        const descriptions = this._getDescriptions();
        Object.keys(descriptions).forEach((key) => {
            const description = descriptions[key];
            description.presets?.forEach((name) => {
                (0, entity_1.applyPreset)(description, name);
            });
        });
        return descriptions;
    }
}
exports.MetaController = MetaController;
//# sourceMappingURL=meta.ctl.js.map