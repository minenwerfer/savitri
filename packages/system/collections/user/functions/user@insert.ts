import * as bcrypt from 'bcrypt'
import type { ApiFunction } from '../../../../api/types'
import { useCollection } from '../../../../api'
import { User } from '../user.description'
import { saveWithExtra } from '../user.helper'

type Props = {
  what: Omit<Partial<User>, 'self_registered'> & {
    self_registered: true
    extra: Record<string, any>
  }
}

const insert: ApiFunction<Props> = async (props, token, ctx) => {
  const { apiConfig } = ctx
  props.what.group = apiConfig.group

  // user is being inserted by a non-root user
  if( token?.user.role !== 'root' ) {
    const userId = props.what._id = token?.user._id
    delete props.what.role

    // a new user is being created
    if( !userId ) {
      if( !apiConfig.allowSignup ) {
        throw new Error(
          `signup is not allowed`
        )
      }

      props.what.self_registered = true

      if( apiConfig.signupDefaults ) {
        Object.assign(props.what, apiConfig.signupDefaults)
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

  return props.what.extra
    ? saveWithExtra(props, token, ctx)
    : useCollection('user', ctx).insert(props, token)
}

export default insert
