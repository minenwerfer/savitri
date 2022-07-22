import { Request, ResponseToolkit } from '@hapi/hapi'
import type { CollectionDescription } from '../../../../common/types'
import { AuthorizationError } from '.././../exceptions'
import { Model } from '../../database'
import { TokenService } from '../../services'
import assert from 'assert'

export type HandlerRequest = {
  payload: {
    offset?: number
    limit?: number
    filters?: any
    what?: any
  }
}

export abstract class Controller<T> {
  private _webInterface: Controller<T>
  protected _description?: Partial<CollectionDescription>

  protected _model: Model<T>

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
      forbiddenMethods?: Array<string>,
      publicMethods?: Array<string>,
      rawMethods?: Record<string, string>
    }
  ) {
    this._description = props?.description || {}
    this._publicMethods = props?.publicMethods || this._publicMethods
    this._forbiddenMethods = props?.forbiddenMethods || []
    this._rawMethods = props?.rawMethods || {}

    this._webInterface = new Proxy(this, {
      get: (target, key: string) => {
        assert(
          !this._internal.includes(key),
          'forbidden method (cannot be called externally)'
        )

        assert(
          !this._forbiddenMethods.includes(key),
          'forbidden method (explicitly forbidden)'
        )

        const method = (target as Record<string, any>)[key]
        const alwaysAttribute = this._description?.alwaysAttribute

        return function(req: Request & HandlerRequest, res: ResponseToolkit, decodedToken: any) {
          const { collection: collectionName } = target._description || {}

          assert(
            collectionName,
            'collection is undefined'
          )

          if( !target._publicMethods?.includes(key) && ( !decodedToken?.access?.capabilities || !decodedToken.access.capabilities[collectionName]?.includes(key) )) {
            if( decodedToken?.access ) {
              throw new Error('forbidden method (access denied)')
            }

            throw new AuthorizationError('signed out')
          }

          const payload = Object.keys(req.payload||{}).length === 0
            ? { filters: {} }
            : req.payload

          if( typeof req.payload?.limit === 'number' && (req.payload.limit > 150 || req.payload.limit <= 0) ) {
            req.payload.limit = 150
          }

          if( decodedToken.access?.visibility !== 'everything' || alwaysAttribute ) {
            if( payload.what ) payload.what.user_id = decodedToken._id
            if( payload.filters ) payload.filters.user_id = decodedToken._id
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
    return this._webInterface
  }

  /**
   * @virtual @method
   * Describes the controller.
   */
  public describe(): object {
    return this._description
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
