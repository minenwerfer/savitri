import type { CollectionDescription } from '../../../types'
import { preloadDescription } from '../../../api/core/collection'
import { getEntityAsset } from '../../../api/core/assets'
import * as SystemCollections from '../../collections/exports'

const __cachedDescriptions: Record<string, CollectionDescription> = {}

const getUserCollections = (dynamic?: boolean) => {
  if( dynamic ) {
    return require(`${process.cwd()}/collections`)
  }

  const { readdirSync } = require('fs')
  return readdirSync(`${process.cwd()}/collections`).reduce((a: any, d: string) => {
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

export const getDescriptions = (dynamicUserCollections?: boolean): Record<string, CollectionDescription> => {
  if( Object.keys(__cachedDescriptions).length > 0 ) {
    return __cachedDescriptions
  }

  const UserCollections = getUserCollections(dynamicUserCollections)
  const target: Record<string, CollectionDescription> = {
    ...UserCollections,
    ...SystemCollections
  }

  const descriptions = Object.entries(target).reduce((a: any, [, collectionSchema]) => {
    return {
      ...a,
      [collectionSchema.$id]: preloadDescription(collectionSchema)
    }
  }, {})

  Object.assign(__cachedDescriptions, descriptions)
  return descriptions
}

