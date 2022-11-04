import * as bcrypt from 'bcrypt'
import { Types } from '../../../api/core/database'

import type { DecodedToken } from '../../../api/types'
import { TokenService } from '../../../api/core/token'
import { Mutable, getController } from '../../../api/core/controller'
import { UserDocument, default as User } from './user.model'
import { default as Description } from './index.json'

/**
 * @exports
 * @class
 * User controller. Must provide methods for authentication, access level, etc.
 */
export class UserController extends Mutable<UserDocument> {
  constructor() {
    super(User, Description, {
      rawMethods: {
        'authenticate': 'application/json'
      }
    })
  }

  private _userExtraModel() {
    return require(`${process.cwd()}/collections/userExtra/userExtra.model`).default
  }

  private async _saveWithExtra(props: any) {
    const { extra } = props.what

    const UserExtra = this._userExtraModel()
    const userExtra = new UserExtra({
      ...extra,
      owner: new Types.ObjectId()
    })

    await userExtra.validate()
    const user = await super.insert.call(this, props)

    /**
     * For the future reference: I decided to call Mutable.insert instead of
     * Model.create because with the former way user can set userExtra access
     * control and guards.
     */
    const userExtraInstance = new (getController('userExtra'))
    userExtraInstance.injected = this.injected

    await userExtraInstance.insert({
      what: {
        ...extra,
        owner: user._id
      }
    })

    return user
  }

  public override async insert(props: { what: any }, token: DecodedToken) {
    props.what.group = this.apiConfig.group

    // user is being inserted by a non-root user
    if( token?.user?.role !== 'root' ) {
      const userId = props.what._id = token.user?._id
      delete props.what.role

      // a new user is being created
      if( !userId ) {
        if( !this.apiConfig.allowSignup ) {
          throw new Error(
            `signup is not allowed`
          )
        }

        props.what.self_registered = true

        if( this.apiConfig.signupDefaults ) {
          Object.assign(props.what, this.apiConfig.signupDefaults)
        }
      }
    }

    if( !token?.user && !props.what.password ) {
      throw new Error(
        `password is required`
      )
    }

    if( props.what.password ) {
      props.what.password = await bcrypt.hash(props.what.password, 10)
    }

    if( props.what.password === null ) {
      delete props.what.password
    }

    if( props.what.extra ) {
      return this._saveWithExtra(props)
    }

    return super.insert.call(this, props)
  }

  /**
   * @method
   * @param {string} username - string to match email or another field
   * @param {string} password - plain text password
   */
  public async authenticate(props: {
    email: string
    password: string
  }):
    Promise<{
      user: Pick<UserDocument,
        'first_name'
        | 'last_name'
        | 'email'
        | 'role'
        | 'active'
        >
      extra: any
      token: string
  }> {
    if( !props.email ) {
      throw new Error('Empty email or password')
    }

    if(
      props.email === process.env.GODMODE_USERNAME
        && props.password === process.env.GODMODE_PASSWORD
    ) {
      const token = await TokenService.sign({
        user: {
          _id: null,
          role: 'root'
        },
      }) as string

      return {
        user: {
          first_name: 'God',
          last_name: 'Mode',
          email: '',
          role: 'root',
          active: true,
        },
        extra: {},
        token
      }
    }

    const user = await this.model.findOne({ email: props.email }).select('+password')
    if( !user || !await user.testPassword(props.password)  ) {
      throw new Error('invalid username or password')
    }

    const { password, ...leanUser } = user.toObject()
    if( !user.active ) {
      throw new Error('this user is inactive')
    }

    const tokenContent = {
      user: {
        _id: leanUser._id,
        role: leanUser.role
      },
      extra: {}
    }

    const response = {
      user: leanUser,
      extra: {},
    }

    if( this.apiConfig.populateUserExtra ) {
      const UserExtra = this._userExtraModel()
      const projection = this.apiConfig.populateUserExtra
        .reduce((a, f) => ({ ...a, [f]: 1 }), {})

      const userExtra = await UserExtra
        .findOne({ owner: leanUser._id }, projection)
        .lean()

      tokenContent.extra = userExtra
      response.extra = userExtra
    }


    const token = await TokenService.sign(tokenContent) as string

    return {
      ...response,
      token
    }
  }
}
