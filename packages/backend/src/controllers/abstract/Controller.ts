import { Request, ResponseToolkit } from '@hapi/hapi'
import { Model } from '../../database'
import { TokenService } from '../../services'

export interface HandlerRequest {
  payload: {
    offset?: number
    limit?: number
    filters?: any
    what?: any
  }
}

export abstract class Controller<T> {
  private _webInterface: Controller<T>
  protected _description: any

  protected _model: Model<T>

  /**
   * @protected @readonly
   * Supposed to contain method names as strings.
   */
  protected readonly _internal: string[] = []

  protected _publicMethods: string[] = [
    'describe'
  ]

  protected _rawMethods: { [key: string]: string } = {}
  protected _forbiddenMethods: string[] = []

  /**
   * @constructor
   * Sets controller metadata and creates a proxy that passes
   * req.payload instead of req as first parameter and forbiddens call if
   * user hasn't the capability set.
   */
  constructor(props: { description?: any, forbiddenMethods?: string[], publicMethods?: string[], rawMethods?: { [key: string]: string } }) {
    this._description = props?.description
    this._publicMethods = props?.publicMethods || this._publicMethods
    this._forbiddenMethods = props?.forbiddenMethods || []
    this._rawMethods = props?.rawMethods || {}

    this._webInterface = new Proxy(this, {
      get: (target, key: string) => {

        if( this._internal.includes(key) ) {
          throw new Error('forbidden method (cannot be called externally)')
        }

        if( this._forbiddenMethods.includes(key) ) {
          throw new Error('forbidden method (explicitly forbidden)')
        }

        const method = (target as { [key: string]: any })[key]
        const alwaysAttribute = this._description?.alwaysAttribute
        return function(req: Request & HandlerRequest, res: ResponseToolkit, decodedToken: any) {

          const { module } = target._description || {}
          if( !module ) {
            throw new Error('module is undefined')
          }

          if( !target._publicMethods?.includes(key) && ( !decodedToken?.access?.capabilities || !decodedToken.access.capabilities[module]?.includes(key) )) {

            if( decodedToken?.access ) {
              throw new Error('forbidden method (access denied)')
            }

            throw new Error('signed out')
          }

          const payload = Object.keys(req.payload||{}).length === 0
            ? { filters: {} }
            : req.payload

          if( typeof req.payload?.limit === 'number' && (req.payload.limit > 150 || req.payload.limit <= 0) ) {
            req.payload.limit = 150
          }

          if( decodedToken.access?.visibility !== 'everything' || alwaysAttribute ) {
            if( payload.what ) payload.what.user_id = decodedToken._id;
            if( payload.filters ) payload.filters.user_id = decodedToken._id;
          }

          (req as { -readonly [P in keyof Request]: Request[P] }).payload = payload

          const result = method.call(target, payload, res, decodedToken)
          return result
        }
      }

    })
  }

  public rawType(verb: string): string|undefined {
    return this._rawMethods[verb]
  }

  get webInterface(): Controller<T> {
    return this._webInterface;
  }

  /**
   * @virtual @method
   * Describes the controller.
   */
  public describe(): object {
    return this._description;
  }

  public async forward(this: any, route: string, props: any, decodedToken: any) {
    delete decodedToken.exp
    delete decodedToken.iap
    const token = TokenService.sign(decodedToken, this.fwdTokenSecret)

    if( !this.http.token ) {
      this.http.token = token
    }

    const { data: { result } } = await this.http.post(route, props)
    return result
  }
}
