import axios from 'axios';
export * from 'axios';
/**
 * @exports
 * @class
 *
 * A wrapper for sending HTTP requests.
 */
export class RequestProvider {
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
        this._instance = axios.create({
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
