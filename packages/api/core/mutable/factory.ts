import { useAccessControl, Options } from './access'
import { getDescriptions } from '../descriptions'
import useFunctions from './functions'

const descriptions = getDescriptions()

export const useCollection = (collectionName: string, explicitOptions?: Options) => {
  const description = descriptions[collectionName]

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
    null,
    description,
    access
  )
}
