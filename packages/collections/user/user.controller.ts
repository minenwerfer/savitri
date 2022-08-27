import * as bcrypt from 'bcrypt'
import * as R from 'ramda'

import { TokenService } from '../../api/core/services/token'
import { Mutable } from '../../api/core/controller'
import { UserDocument, User } from './user.model'
import { AccessProfileDocument, AccessProfile } from '../accessProfile/accessProfile.model'
import { default as Description } from './index.json'

const {
  GODMODE_USERNAME,
  GODMODE_PASSWORD

} = process.env


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
    if( decodedToken?.access?.role !== 'root' ) {
      const userId = props.what._id = decodedToken.user?._id
      delete props.what.access

      // a new user is being created
      if( !userId ) {
        if( !this.apiConfig.allowSignup ) {
          throw new Error(
            `signup is not allowed`
          )
        }

        props.what.self_registered = true

        if( this.apiConfig.signupDefaults ) {
          const {
            role,
            ...signupDefaults
          } = this.apiConfig.signupDefaults

          // if there is a role, retrieve first access profile matching it
          if( role ) {
            const accessProfile = await AccessProfile.findOne({ role }, { _id: 1 })

            if( !accessProfile ) {
              throw new Error(
                `${role} was set as a default role but no matching access profile was found`
              )
            }

            props.what.access = accessProfile._id
          }

          // directly assign everything else
          Object.assign(props.what, signupDefaults)
        }
      }
    }

    if( !decodedToken?.user?._id && !props.what.password ) {
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
        | 'active'
        >
      access: Omit<AccessProfileDocument, '_id'> & {
        _id?: AccessProfileDocument['_id']
      }|object
      extra: any
      token: string
  }> {
    if( !props.email ) {
      throw new Error('Empty email or password')
    }

    if( props.email === GODMODE_USERNAME && props.password === GODMODE_PASSWORD ) {
      const access = {
        name: 'Godmode',
        role: 'root',
        capabilities: {
          user: [
            'getAll',
            'insert'
          ],
          accessProfile: [
            'get',
            'getAll',
            'insert'
          ]
        }
      }

      const token = await TokenService.sign({
        user: { _id: null },
        access
      }) as string

      return {
        user: {
          first_name: 'God',
          last_name: 'Mode',
          full_name: 'God mode',
          email: '',
          active: true,
        },
        access,
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
      leanUser.access = {}
    }

    const tokenContent = {
      user: R.pick(['_id'], leanUser),
      access: R.pick([
        'role',
        'capabilities'
      ], leanUser.access),
      extra: {}
    }

    const response = {
      user: leanUser,
      access: leanUser.access,
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
