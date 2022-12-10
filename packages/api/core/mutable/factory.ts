import type { ApiContext, ApiContextWithAC } from '../../types'
import { getEntityAsset } from '../assets'
import { useAccessControl } from './access'
import useFunctions from './functions'

export const useCollection = (collectionName: string, _context: ApiContext|null = null) => {
  const context = _context || {} as ApiContext

  const description = getEntityAsset<'description'>(collectionName, 'description')
  const model = getEntityAsset<'model'>(collectionName, 'model')

  if( !description ) {
    throw new Error(
      `description of ${collectionName} not found`
    )
  }

  const options = description.options
  // const options = Object.assign(
  //   context?.options||{},
  //   description.options||{}
  // ) as Options

  const access = useAccessControl(description, options, context)
  Object.assign(context, {
    options,
    access
  })

  return useFunctions(
    model,
    description,
    context as ApiContextWithAC
  )
}
