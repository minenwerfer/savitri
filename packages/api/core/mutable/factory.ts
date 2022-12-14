import type { ApiContext, ApiContextWithAC, DecodedToken } from '../../types'
import type { CollectionFunctions } from './functions.types'
import { getEntityAsset } from '../assets'
import { useAccessControl } from './access'
import useFunctions from './functions'

type Fallback = (props: any, token: DecodedToken|null) => any
type AnyFunction = CollectionFunctions & Record<string, Fallback>

export const useCollection = (collectionName: string, _context: ApiContext|null = null): AnyFunction => {
  const context = _context || {} as ApiContext

  const description = getEntityAsset<'description'>(collectionName, 'description')
  const originalCollectionName = description.alias || collectionName

  const model = getEntityAsset<'model'>(originalCollectionName, 'model')

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
