"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getController = exports.commonControllers = void 0;
/**
 * @exports @const
 * Array of lowercased controller names.
*/
exports.commonControllers = [
    'accessProfile',
    'application',
    'feedback',
    'file',
    'notification',
    'release',
    'report',
    'user',
];
/**
 * @exports @const
 * Retrieves controller class from alias.
 */
const getController = (controller) => {
    const controllerPath = exports.commonControllers.includes(controller)
        ? __dirname
        : `${process.cwd()}/api-assets/controllers`;
    const controllerFile = `${controller.replace(/\./g, '')}.ctl`;
    const controllerName = `${controller.replace(/\./g, '').capitalize()}Controller`;
    const Controller = require(`${controllerPath}/${controllerFile}`)[controllerName];
    return Controller;
};
exports.getController = getController;
//# sourceMappingURL=index.js.map