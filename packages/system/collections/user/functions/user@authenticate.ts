import type { CollectionFunction } from '../../../../api/types'
import { TokenService } from '../../../../api/core/token'
import UserModel from '../user.model'
import { userExtraModel } from '../user.helper'

type Props = {
  email: string
  password: string
}

const authenticate: CollectionFunction<Props> = async (props, _decodedToken, apiConfig) => {
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

  const user = await UserModel.findOne({ email: props.email }).select('+password')
  if( !user || !await user.testPassword!(props.password) ) {
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

  if( apiConfig.populateUserExtra ) {
    const UserExtra = userExtraModel()
    const projection = apiConfig.populateUserExtra
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

export default authenticate
