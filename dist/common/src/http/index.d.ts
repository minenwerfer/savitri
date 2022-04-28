import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
export * from 'axios';
/**
 * @exports
 * @class
 *
 * A wrapper for sending HTTP requests.
 */
export declare class RequestProvider {
    private _instance;
    private _proxiedInstance;
    private _defaultConfig;
    private _authToken;
    private _maxRetries;
    private _retries;
    /**
     * @constructor
     * @param {AxiosRequestConfig} config - pass this config to axios along with the default one
     */
    constructor(config?: AxiosRequestConfig);
    get token(): string | null;
    set token(value: string | null);
    get instance(): AxiosInstance;
    /**
     * @static @method
     * Throws an error if request status is 200<=x<304 but _error property is present.
     */
    static throwOnError({ data }: AxiosResponse): void;
    request(config: AxiosRequestConfig): Promise<AxiosResponse>;
    get(uri: string): Promise<AxiosResponse>;
    post(uri: string, data: any, options?: {}): Promise<AxiosResponse>;
}
