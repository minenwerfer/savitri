import { ApiConfig } from '../../types'

export const beforeRead: ApiConfig['beforeRead'] = (token, collectionName) => {
  const preset: any = {}
  return preset
}

export const beforeWrite: ApiConfig['beforeWrite'] = (token, collectionName) => {
  const preset: any = {}
  return preset
}
