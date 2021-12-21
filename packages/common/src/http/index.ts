import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
export * from 'axios'

/**
 * @exports
 * @class
 *
 * A wrapper for sending HTTP requests.
 */
export class RequestProvider {
  private _instance: AxiosInstance
  private _proxiedInstance: AxiosInstance
  private _defaultConfig: object = {
    //
  }

  /**
   * @constructor
   * @param {AxiosRequestConfig} config - pass this config to axios along with the default one
   */
  constructor(config?: AxiosRequestConfig) {
    this._instance = axios.create({
      ...this._defaultConfig,
      ...config,
    })

    this._instance.interceptors.request.use((config: any) => {
      const newConfig = { ...config }

      if( 'sessionStorage' in global ) {
        const authToken = sessionStorage.getItem('auth:token')

        if( authToken ) {
          Object.assign(newConfig, {
            headers: {
              authorization: `Bearer ${authToken}`
            }
          })
        }
      }

      return newConfig
    })

    /**
     * Chains throwOnError static method on axios calls.
     */
    this._proxiedInstance = new Proxy(this._instance, {
      get: (target: any, key: string) => {

        const method = target[key]
        if( !['request', 'post', 'get'].includes(key) )  {
           return typeof method === 'function'
             ? (...args: any) => method.apply(target, args)
             : method
        }

        return (...args: any) => {
          return method.apply(target, args)
            .then((res: AxiosResponse) => {
              RequestProvider.throwOnError(res)
              return res
            })
        }
      }

    })
  }

  get instance(): AxiosInstance {
    return this._proxiedInstance;
  }

  /**
   * @static @method
   * Throws an error if request status is 200<=x<304 but _error property is present.
   */
  static throwOnError({ data }: AxiosResponse) {
    const { _error, message } = data;
    if( _error ) {
      throw message || _error;
    }
  }

  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }

  public get(uri: string): Promise<AxiosResponse> {
    return this.instance.get(uri)
  }

  public post(uri: string, data: object): Promise<AxiosResponse> {
    return this.instance.post(uri, data)
  }
}
