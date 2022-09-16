import * as bcrypt from 'bcrypt'

import { TokenService } from '../../api/core/services/token'
import { Mutable } from '../../api/core/controller'
import { UserDocument, User } from './user.model'
import { default as Description } from './index.json'

/**
 * @exports
 * @class
 * User controller. Must provide methods for authentication, access level, etc.
 */
export class UserController extends Mutable<UserDocument> {
  constructor() {
    super(User, Description, {
      publicMethods: [
        'authenticate',
        'insert'
      ],
      rawMethods: {
        'authenticate': 'application/json'
      }
    })
  }

  public override async insert(props: { what: any }, decodedToken: any) {
    props.what.group = this.apiConfig.group

    // user is being inserted by a non-root user
    if( decodedToken?.user?.role !== 'root' ) {
      const userId = props.what._id = decodedToken.user?._id
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

    if( !decodedToken?.user && !props.what.password ) {
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
  public async authenticate(props: {
    email: string
    password: string
  }):
    Promise<{
      user: Pick<UserDocument,
        'first_name'
        | 'last_name'
        | 'full_name'
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
          full_name: 'God mode',
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
    // do a better job, motherfucker
    // if( !user.active ) {
    //   leanUser.access = {}
    // }

    const tokenContent = {
      user: {
        _id: leanUser._id
      },
      extra: {}
    }

    const response = {
      user: leanUser,
      extra: {},
    }

    if( this.apiConfig.populateUserExtra ) {
      const { UserExtra } = require(`${process.cwd()}/collections/userExtra/userExtra.model`)
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
