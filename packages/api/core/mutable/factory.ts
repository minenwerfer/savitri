import { useAccessControl, Options } from './access'
import { getCollectionAsset } from '../collection/assets'
import useFunctions from './functions'

export const useCollection = (collectionName: string, explicitOptions?: Options) => {
  const description = getCollectionAsset(collectionName, 'description')
  const model = getCollectionAsset(collectionName, 'model')

  if( !description ) {
    throw new Error(
      `description of ${collectionName} not found`
    )
  }

  const options = Object.assign(
    explicitOptions||{},
    description.options
  ) as Options

  const access = useAccessControl(description, options)
  return useFunctions(
    model,
    description,
    access
  )
}
