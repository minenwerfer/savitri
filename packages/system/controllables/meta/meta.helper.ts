import { readdirSync } from 'fs'
import type { CollectionDescription } from '../../../types'
import type { ApiContext } from '../../../api/types'
import { preloadDescription } from '../../../api/core/collection'
import { getEntityAsset } from '../../../api/core/assets'

const __cachedDescriptions: Record<string, CollectionDescription> = {}
export const cachedDescriptions = __cachedDescriptions

const discoverDescriptions = (dynamic?: boolean, internal?: boolean) => {
  const path = internal
    ? `${__dirname}/../../collections`
    : `${process.cwd()}/collections`

  if( dynamic ) {
    return require(path)
  }

  return readdirSync(path).reduce((a: Record<string, any>, d) => {
    try {
      return {
        ...a,
        [d]: getEntityAsset(d, 'description')
      }
    } catch(e: any) {
      if( e.code !== 'MODULE_NOT_FOUND' ) {
        throw e
      }

      return a
    }
  }, {})
}

export const getDescriptions = ({
  descriptions: presetDescriptions,
  apiConfig: {
    dynamicCollections
  },
}: ApiContext): Record<string, CollectionDescription> => {
  if( Object.keys(__cachedDescriptions).length > 0 ) {
    return __cachedDescriptions
  }

  const target: Record<string, CollectionDescription> = {
    ...presetDescriptions||{},
    ...discoverDescriptions(dynamicCollections),
    ...discoverDescriptions(false, true)
  }

  const descriptions = Object.entries(target).reduce((a, [, collectionSchema]) => {
    return {
      ...a,
      [collectionSchema.$id]: preloadDescription(collectionSchema)
    }
  }, {})

  Object.assign(__cachedDescriptions, descriptions)
  return descriptions
}

