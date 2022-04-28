"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaController = void 0;
const controller_1 = require("../../core/controller");
const entity_1 = require("../../core/entity");
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
        const modulePaths = [
            `${__dirname}/..`,
            `${process.cwd()}/modules`,
            ...global.modules
                ? global.modules.map(({ name }) => `${process.cwd()}/../../node_modules/${name}/dist/backend/modules`)
                : []
        ];
        const modules = modulePaths
            .reduce((a, dir) => ({
            ...a,
            ...readdirSync(dir)
                .filter((d) => !d.startsWith('_'))
                .filter((d) => existsSync(`${dir}/${d}/index.json`))
                .reduce((a, d) => ({ ...a, [d]: require(`${dir}/${d}/index.json`) }), {})
        }), {});
        return modules;
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
//# sourceMappingURL=meta.controller.js.map