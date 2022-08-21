import { Request, ResponseToolkit } from '@hapi/hapi'
import type { CollectionDescription } from '../../../common/types'
import type { HandlerRequest } from '../../types'
import { AuthorizationError, PermissionError } from '../exceptions'
import { TokenService } from '../services'

export abstract class Controller {
  private _webInterface: Controller
  protected _description?: Partial<CollectionDescription>
  protected _controllerName?: string
  public injected: Record<string, any>

  /**
   * @protected @readonly
   * Supposed to contain method names as strings.
   */
  protected readonly _internal: Array<string> = []

  protected _publicMethods: Array<string> = [
    'describe'
  ]

  protected _rawMethods: Record<string, string> = {}
  protected _forbiddenMethods: Array<string> = []

  /**
   * @constructor
   * Sets controller metadata and creates a proxy that passes req.payload
   * instead of req as first parameter and forbiddens call if user hasn't the
   * capability set.
   */
  constructor(
    readonly props: {
      description?: Partial<CollectionDescription>,
      controller?: string
      forbiddenMethods?: Array<string>,
      publicMethods?: Array<string>,
      rawMethods?: Record<string, string>
    }
  ) {
    this._description = props?.description || {}
    this._controllerName = this._description.collection || props.controller
    this._publicMethods = props?.publicMethods || this._publicMethods
    this._forbiddenMethods = props?.forbiddenMethods || []
    this._rawMethods = props?.rawMethods || {}

    this._webInterface = new Proxy(this, {
      get: (target, key: string) => {
        if( this._internal.includes(key) ) {
          throw new PermissionError('forbidden method (cannot be called externally)')
        }

        if( this._forbiddenMethods.includes(key) ) {
          throw new PermissionError('forbidden method(explicitly forbidden)')
        }

        const method = (target as Record<string, any>)[key]
        // const alwaysAttribute = this._description?.alwaysAttribute

        return function(req: HandlerRequest, decodedToken: any, res?: ResponseToolkit) {
          const controllerName = target._description?.collection || target._controllerName

          if( !controllerName ) {
            throw new Error('controller is undefined')
          }

          if(
            !target._publicMethods?.includes(key)
            && ( !decodedToken?.access?.capabilities || !decodedToken.access.capabilities[controllerName]?.includes(key) )
          ) {
            if( decodedToken?.access ) {
              throw new PermissionError('forbidden method (access denied)')
            }

            throw new AuthorizationError('signed out')
          }

          const payload = Object.keys(req.payload||{}).length === 0
            ? { filters: {} }
            : req.payload

          if(
            typeof req.payload?.limit === 'number'
            && (req.payload.limit > 150 || req.payload.limit <= 0)
          ) {
            req.payload.limit = 150
          }

          // if( decodedToken.access?.visibility !== 'everything' || alwaysAttribute ) {
          //   if( payload.what ) payload.what.user_id = decodedToken._id
          //   if( payload.filters ) payload.filters.user_id = decodedToken._id
          // }

          (req as { payload: Request['payload'] }).payload = payload

          const result = method.call(target, payload, decodedToken, res)
          return result
        }
      }

    })
  }

  public rawType(verb: string): string|undefined {
    return this._rawMethods[verb]
  }

  get webInterface(): Controller {
    return this._webInterface
  }

  public describe(): Partial<CollectionDescription>|object {
    return this._description||{}
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
