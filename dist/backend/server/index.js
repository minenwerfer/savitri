"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const Hapi = __importStar(require("@hapi/hapi"));
const controllers_1 = require("../src/controllers");
const tokenService_1 = require("../src/services/tokenService");
require("../../common/src/polyfill");
const FileController_1 = require("../src/controllers/FileController");
async function handler(request, h) {
    try {
        const { params: { controller, verb } } = request;
        if (/^_/.test(verb)) {
            throw 'cannot call private method';
        }
        const controllerPath = controllers_1.commonControllers.includes(controller)
            ? '../src/controllers'
            : `${process.cwd()}/api-assets/controllers`;
        const controllerName = `${controller.replace(/\./g, '').capitalize()}Controller`;
        const Controller = require(`${controllerPath}/${controllerName}`)[controllerName];
        const instance = new Controller;
        if (!(verb in instance)) {
            throw 'invalid verb';
        }
        const token = request.headers.authorization
            ? await tokenService_1.TokenService.decode(request.headers.authorization.split('Bearer ').pop() || '')
            : {};
        // use webinterface whenever it's available
        const result = await (instance.webInterface || instance)[verb](request, h, token);
        if (/_?get/i.test(verb) && !result) {
            throw 'item not found';
        }
        const mime = instance.rawType(verb);
        if (mime) {
            return h.response(result)
                .header('Content-Type', mime);
        }
        return {
            result,
            ...(Array.isArray(result) ? {
                recordsCount: result.length,
                recordsTotal: await instance.count({ filter: request.payload?.filter || {} }),
                offset: request.payload?.offset || 0,
                // 35 is a fallback
                limit: +(process.env.PAGINATION_LIMIT || 35),
            } : {})
        };
    }
    catch (error) {
        console.trace(error);
        const { message } = error;
        return {
            message,
            _error: error
        };
    }
    finally {
        //
    }
}
const init = async (port = 3000) => {
    const server = Hapi.server({
        port,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
                headers: [
                    'Accept',
                    'Accept-Version',
                    'Authorization',
                    'Content-Length',
                    'Content-MD5',
                    'Content-Type',
                    'Date',
                    'X-Api-Version'
                ]
            }
        }
    });
    server.route({
        method: ['GET', 'POST'],
        path: '/api/{controller}/{verb}',
        handler
    });
    server.route({
        method: ['GET'],
        path: '/api/download/{hash}/{options?}',
        handler: async (request, h) => {
            try {
                const instance = new FileController_1.FileController;
                const { hash, options } = request.params;
                const { filename, content, mime } = await instance.download(hash);
                const parsedOptions = (options || '').split(',');
                const has = (opt) => parsedOptions.includes(opt);
                return h.response(content)
                    .header('Content-Type', mime)
                    .header('Content-Disposition', `${has('download') ? 'attachment; ' : ''}filename=${filename}`);
            }
            catch (error) {
                console.trace(error);
                const { message } = error;
                return {
                    message,
                    _error: error
                };
            }
        }
    });
    return server;
};
exports.init = init;
//# sourceMappingURL=index.js.map