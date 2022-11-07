import type { CollectionDescription } from '../../../common/types'
import { preloadCollection } from '../../../api/core/collection'
import * as SystemCollections from '../../collections'

const __cachedDescriptions: Record<string, CollectionDescription> = {}

const getUserCollections = (dynamic?: boolean) => {
  if( dynamic ) {
    return require(`${process.cwd()}/collections`)
  }

  const { readdirSync, existsSync } = require('fs')
  return readdirSync(`${process.cwd()}/collections`).reduce((a: any, d: string) => {
    try {
      const
        isValid = !d.startsWith('_'),
        isJson = isValid && existsSync(`collections/${d}/${d}.schema.json`),
        path = require.resolve(`${process.cwd()}/collections/${d}/${d}.schema${isJson ? '.json' : ''}`)


      if( !isValid ) {
        return a
      }

      return {
        ...a,
        [d]: isJson
          ? require(path)
          : require(path)[d[0].toUpperCase() + d.slice(1)]
      }
    } catch(e) {
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
      [collectionSchema.collection]: preloadCollection(collectionSchema)
    }
  }, {})

  Object.assign(__cachedDescriptions, descriptions)
  return descriptions
}

