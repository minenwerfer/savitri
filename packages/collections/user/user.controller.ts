import path from 'path'
import * as bcrypt from 'bcrypt'

import { TokenService } from '../../api/core/services/token'
import { Mutable } from '../../api/core/controller'
import { UserDocument, User } from './user.model'
import type { AccessProfileDocument } from '../accessProfile/accessProfile.model'
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
      publicMethods: ['authenticate'],
      rawMethods: {
        'authenticate': 'application/json'
      }
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
  public async authenticate(props: { email: string, password: string }):
    Promise<{
      user: Pick<UserDocument, 'name' | 'first_name' | 'email' | 'active'> 
      access: Omit<AccessProfileDocument, '_id'> & {
        _id?: AccessProfileDocument['_id']
      }
      token: string
  }> {
    if( !props.email ) {
      throw new Error('Empty email or password')
    }

    const {
      GODMODE_USERNAME,
      GODMODE_PASSWORD

    } = process.env

    if( props.email === GODMODE_USERNAME && props.password === GODMODE_PASSWORD ) {
      const access = {
        name: 'Godmode',
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

      const token = await TokenService.sign({ access }) as string

      return {
        user: {
          name: 'Godmode',
          first_name: 'Godmode',
          email: '',
          active: true,
        },
        access,
        token
      }
    }

    const user = await this.model.findOne({ email: props.email }).select('+password')
    if( !user || !await user.testPassword(props.password)  ) {
      throw new Error('invalid username or password')
    }

    const { password, ...leanUser } = user.toObject()
    const token = await TokenService.sign({ access: leanUser.access }) as string
    return {
      user: leanUser,
      access: leanUser.access,
      token
    }
  }
}
