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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestProvider = void 0;
const axios_1 = __importDefault(require("axios"));
__exportStar(require("axios"), exports);
/**
 * @exports
 * @class
 *
 * A wrapper for sending HTTP requests.
 */
class RequestProvider {
    _instance;
    _proxiedInstance;
    _defaultConfig = {
    //
    };
    /**
     * @constructor
     * @param {AxiosRequestConfig} config - pass this config to axios along with the default one
     */
    constructor(config) {
        this._instance = axios_1.default.create({
            ...this._defaultConfig,
            ...config,
        });
        this._instance.interceptors.request.use((config) => {
            const newConfig = { ...config };
            if ('sessionStorage' in global) {
                const authToken = sessionStorage.getItem('auth:token');
                if (authToken) {
                    Object.assign(newConfig, {
                        headers: {
                            authorization: `Bearer ${authToken}`
                        }
                    });
                }
            }
            return newConfig;
        });
        /**
         * Chains throwOnError static method on axios calls.
         */
        this._proxiedInstance = new Proxy(this._instance, {
            get: (target, key) => {
                const method = target[key];
                if (!['request', 'post', 'get'].includes(key)) {
                    return typeof method === 'function'
                        ? (...args) => method.apply(target, args)
                        : method;
                }
                return (...args) => {
                    return method.apply(target, args)
                        .then((res) => {
                        RequestProvider.throwOnError(res);
                        return res;
                    });
                };
            }
        });
    }
    get instance() {
        return this._proxiedInstance;
    }
    /**
     * @static @method
     * Throws an error if request status is 200<=x<304 but _error property is present.
     */
    static throwOnError({ data }) {
        const { _error, message } = data;
        if (_error) {
            throw message || _error;
        }
    }
    request(config) {
        return this.instance.request(config);
    }
    get(uri) {
        return this.instance.get(uri);
    }
    post(uri, data) {
        return this.instance.post(uri, data);
    }
}
exports.RequestProvider = RequestProvider;
