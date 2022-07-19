import path from 'path'
import * as bcrypt from 'bcrypt'

import { UserDocument, User } from './user.model'
import { TokenService } from '../../api/core/services/token.service'
import { Mutable } from '../../api/core/controller'
import { default as Description } from './index.json'

const buildConfig = require(path.join(process.cwd(), 'build.json'))

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

  public override async insert(props: { what: any }, res: unknown, decodedToken: any) {
    props.what.group = buildConfig.group

    if( decodedToken.access.visibility !== 'everything' ) {
      props.what._id = decodedToken._id
      delete props.what.access
    }

    if( props.what.password ) {
      props.what.password = await bcrypt.hash(props.what.password, 10)
    }

    if( props.what.password === null ) {
      delete props.what.password
    }

    return super.insert.call(this, props)
  }

  public override getAll(props: { filters: any }) {
    return super.getAll.call(this, {
      ...props,
      sort: {
        access: 1
      }
    })
  }

  /**
   * @method
   * @param {string} username - string to match email or another field
   * @param {string} password - plain text password
   */
  public async authenticate(props: { email: string, password: string }): Promise<User & { token: string }> {
    if( !props.email ) {
      throw new Error('Empty email or password')
    }

    const {
      GODMODE_USERNAME,
      GODMODE_PASSWORD

    } = process.env

    if( props.email === GODMODE_USERNAME && props.password === GODMODE_PASSWORD ) {
      const access = {
        visibility: 'everything',
        capabilities: {
          user: [
            'getAll',
            'insert'
          ],
          accessProfile: [
            'getAll',
            'insert'
          ]
        }
      }

      const token = await TokenService.sign({
        email: GODMODE_USERNAME,
        access
      }) as string

      return {
        name: 'Godmode',
        first_name: 'Godmode',
        email: '',
        active: true,
        token,
        access
      }
    }

    const user = await this._model.findOne({ email: props.email }).select('+password')
    if( !user || !await user.testPassword(props.password)  ) {
      throw new Error('invalid username or password')
    }

    delete user.password
    const token = await TokenService.sign(user.toObject())
    return {
      ...(user as any)._doc,
      password: undefined,
      token
    }
  }
}
