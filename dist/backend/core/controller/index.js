"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getController = exports.commonControllers = void 0;
const { readdirSync } = require('fs');
/**
 * @exports @const
 * Array of lowercased controller names.
*/
exports.commonControllers = readdirSync(`${__dirname}/../../modules`);
/**
 * @exports @const
 * Retrieves controller class from alias.
 */
const getController = (controller) => {
    const controllerPath = (() => {
        const module = (globalThis.modules || [])
            .find(({ exportedEntities }) => {
            return exportedEntities?.includes(controller);
        });
        if (module) {
            return `${process.cwd()}/../../node_modules/${module.name}/dist/backend/entities`;
        }
        return exports.commonControllers.includes(controller)
            ? `${__dirname}/../../entities`
            : `${process.cwd()}/entities`;
    })();
    const sanitizedName = controller.replace(/\./g, '');
    const controllerFile = `${sanitizedName}/${sanitizedName}.controller`;
    const controllerName = `${sanitizedName.capitalize()}Controller`;
    const Controller = require(`${controllerPath}/${controllerFile}`)[controllerName];
    return Controller;
};
exports.getController = getController;
__exportStar(require("./abstract/Controller"), exports);
__exportStar(require("./abstract/Mutable"), exports);
//# sourceMappingURL=index.js.map