import type { ApiFunction } from '../../../../api/types'
import { makeException } from '../../../../api'

const ping: ApiFunction<unknown, void> = (_props, { token }) => {
  if( !token.user?._id ) {
    throw makeException({
      name: 'AuthorizationError',
      message: 'signed out'
    })
  }
}

export default ping
