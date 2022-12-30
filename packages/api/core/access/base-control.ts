import { AccessControl } from '../../types'

export const beforeRead: AccessControl['beforeRead'] = (_token, _collectionName) => {
  const preset: any = {}
  return preset
}

export const beforeWrite: AccessControl['beforeWrite'] = (token, collectionName) => {
  const preset: any = {}

  if( !token?.user?.roles.includes('root') ) {
    return preset
  }

  if( collectionName === 'userExtra' ) {
    preset.owner = token?.user._id
  }

  return preset
}
