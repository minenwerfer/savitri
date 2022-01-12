"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
class Controller {
    _webInterface;
    _description;
    _model;
    /**
     * @protected @readonly
     * Supposed to contain method names as strings.
     */
    _internal = [];
    _publicMethods = [];
    _rawMethods = {};
    /**
     * @constructor
     * Sets controller metadata and creates a proxy that passes
     * req.payload instead of req as first parameter and forbiddens call if
     * user hasn't the capability set.
     */
    constructor(props) {
        this._description = props?.description;
        this._publicMethods = props?.publicMethods || [];
        this._rawMethods = props?.rawMethods || {};
        this._webInterface = new Proxy(this, {
            get: (target, key) => {
                if (this._internal.includes(key)) {
                    throw 'forbidden method (cannot be called externally)';
                }
                const method = target[key];
                return function (req, res, decodedToken) {
                    const { module } = target._description || {};
                    if (!module) {
                        throw 'module is undefined';
                    }
                    if (!target._publicMethods?.includes(key) && (!decodedToken?.access?.capabilities || !decodedToken.access.capabilities[module]?.includes(key))) {
                        throw 'forbidden method';
                    }
                    const payload = Object.keys(req.payload || {}).length === 0
                        ? { filter: {} }
                        : req.payload;
                    if (decodedToken.access?.visibility !== 'everything') {
                        if (payload.what)
                            payload.what.user_id = decodedToken._id;
                        if (payload.filter)
                            payload.filter.user_id = decodedToken._id;
                    }
                    req.payload = payload;
                    const result = method.call(target, payload, res, decodedToken);
                    return result;
                };
            }
        });
    }
    rawType(verb) {
        return this._rawMethods[verb];
    }
    get webInterface() {
        return this._webInterface;
    }
    /**
     * @virtual @method
     * Describes the controller.
     */
    describe() {
        return this._description;
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map