"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const services_1 = require("../../services");
class Controller {
    _webInterface;
    _description;
    _model;
    /**
     * @protected @readonly
     * Supposed to contain method names as strings.
     */
    _internal = [];
    _publicMethods = [
        'describe'
    ];
    _rawMethods = {};
    _forbiddenMethods = [];
    /**
     * @constructor
     * Sets controller metadata and creates a proxy that passes
     * req.payload instead of req as first parameter and forbiddens call if
     * user hasn't the capability set.
     */
    constructor(props) {
        this._description = props?.description;
        this._publicMethods = props?.publicMethods || this._publicMethods;
        this._forbiddenMethods = props?.forbiddenMethods || [];
        this._rawMethods = props?.rawMethods || {};
        this._webInterface = new Proxy(this, {
            get: (target, key) => {
                if (this._internal.includes(key)) {
                    throw new Error('forbidden method (cannot be called externally)');
                }
                if (this._forbiddenMethods.includes(key)) {
                    throw new Error('forbidden method (explicitly forbidden)');
                }
                const method = target[key];
                return function (req, res, decodedToken) {
                    const { module } = target._description || {};
                    if (!module) {
                        throw new Error('module is undefined');
                    }
                    if (!target._publicMethods?.includes(key) && (!decodedToken?.access?.capabilities || !decodedToken.access.capabilities[module]?.includes(key))) {
                        if (decodedToken?.access) {
                            throw new Error('forbidden method (access denied)');
                        }
                        throw new Error('signed out');
                    }
                    const payload = Object.keys(req.payload || {}).length === 0
                        ? { filters: {} }
                        : req.payload;
                    if (typeof req.payload?.limit === 'number' && (req.payload.limit > 150 || req.payload.limit <= 0)) {
                        req.payload.limit = 150;
                    }
                    if (decodedToken.access?.visibility !== 'everything') {
                        if (payload.what)
                            payload.what.user_id = decodedToken._id;
                        if (payload.filters)
                            payload.filters.user_id = decodedToken._id;
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
    async forward(route, props, decodedToken) {
        delete decodedToken.exp;
        delete decodedToken.iap;
        const token = services_1.TokenService.sign(decodedToken, this.fwdTokenSecret);
        if (!this.http.token) {
            this.http.token = token;
        }
        const { data: { result } } = await this.http.post(route, props);
        return result;
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map