import { ApiConfig } from '../../types'

export const beforeRead: ApiConfig['beforeRead'] = (token, collectionName) => {
  const preset: any = {}

  if( token?.user?.role === 'root' ) {
    return preset
  }

  if( collectionName === 'userExtra' ) {
    preset.owner = token?.user._id
  }

  return preset
}

export const beforeWrite: ApiConfig['beforeWrite'] = (token, collectionName) => {
  const preset: any = {}
  return preset
}
