import { Request, ResponseToolkit } from '@hapi/hapi'
import type { CollectionDescription } from '../../../types'
import type {
  HandlerRequest,
  ProvidedParams,
  ApiConfig,
  DecodedToken,
  Role
} from '../../types'

// import { AuthorizationError, PermissionError } from '../exceptions'
import baseRoles from '../access/baseRoles'

export abstract class Controller {
  private _webInterface: Controller
  public injected: Omit<ProvidedParams, 'apiConfig'> = {}


  /**
   * @constructor
   * Sets controller metadata and creates a proxy that passes req.payload
   * instead of req as first parameter and forbiddens call if user hasn't the
   * capability set.
   */
  constructor(
    readonly props: {
      description?: CollectionDescription,
      controller: string
      forbiddenMethods?: Array<string>,
      rawMethods?: Record<string, string>,
      provide?: Record<string, any>
    }
  ) {
    if( props.provide ) {
      Object.assign(this.injected, props.provide)
    }

    if( !props.controller ) {
      props.controller = props.description!.$id
    }

    props.controller = props.controller.split('/').pop() as string

    this._webInterface = new Proxy(this, {
      get: (target, key: string) => {
        if( key.startsWith('_') ) {
          // throw new PermissionError('forbidden method (cannot be called externally)')
        }

        if( this.props.forbiddenMethods?.includes(key) ) {
          // throw new PermissionError('forbidden method(explicitly forbidden)')
        }

        return function(req: HandlerRequest, token: DecodedToken, res?: ResponseToolkit) {
          if( !target.isGranted(token, key)) {
            if( token?.user?.role ) {
              // throw new PermissionError('forbidden method (access denied)')
            }

            // throw new AuthorizationError('signed out')
          }

          const payload = Object.keys(req.payload||{}).length === 0
            ? { filters: {} }
            : req.payload;

          (req as { payload: Request['payload'] }).payload = payload

          const method = (target as Record<string, any>)[key]
          const result = method.call(target, payload, token, res)
          return result
        }
      }

    })
  }

  public rawType(verb: string): string|undefined {
    return this.props.rawMethods?.[verb]
  }

  get apiConfig(): ApiConfig {
    return this.injected.apiConfig||{}
  }

  get webInterface(): Controller {
    return this._webInterface
  }

  public describe(): Partial<CollectionDescription>|object {
    return this.props.description||{}
  }

  private _isGranted(
    token: { user?: { role?: string } },
    method:string,
    controller?: string,
    targetRole?: Role
  ) {
    const currentRole = token?.user?.role || 'guest'
    const role = targetRole || this.apiConfig.roles?.[currentRole]

    if( !role ) {
      return false
    }

    const controllerName = controller || this.props.controller!
    const subject = role?.capabilities?.[controllerName]

    return (
      role?.grantEverything
      || subject?.grantEverything
      || subject?.methods?.includes(method)
    )
  }

  public isGranted(
    token: DecodedToken,
    method: string,
    controller?: string
  ) {
    const baseRole = token.user?._id
      ? baseRoles.authenticated
      : baseRoles.unauthenticated

    return this._isGranted(token, method, controller)
      || this._isGranted(token, method, controller, baseRole)
  }
}
