import { existsSync } from 'fs'
import type { Model } from 'mongoose'
import type {
  ApiFunction ,
  AssetType,
  EntityType,
  FunctionPath,
  AssetReturnType

} from '../types'

import { default as SystemCollections } from '../../system/collections'
import { default as SystemControllables } from '../../system/controllables'
import { useCollection } from './collection/use'

const __cached: Record<AssetType, Record<string, any>> = {
  model: {},
  description: {},
  function: {}
}

const cacheIfPossible = (assetName: string, assetType: AssetType, fn: () => any) => {
  const repo = __cached[assetType]
  if( assetName in repo ) {
    return repo[assetName]
  }

  const asset = repo[assetName] = fn()
  return asset
}

const isInternal = (entityName: string, entityType: EntityType = 'collection'): boolean => {
  switch(  entityType ) {
    case 'collection': return entityName in SystemCollections
    case 'controllable': return entityName in SystemControllables
  }
}

const getPrefix = (collectionName: string, internal: boolean, entityType: EntityType = 'collection') => {
  const pluralized = (() => {
    switch( entityType ) {
      case 'collection': return 'collections'
      case 'controllable': return 'controllables'
    }
  })()

  return internal
    ? `${__dirname}/../../system/${pluralized}/${collectionName}`
    : `${process.cwd()}/${pluralized}/${collectionName}`
}

const loadModel = (collectionName: string, internal: boolean): Model<any>|null => {
  const prefix = getPrefix(collectionName, internal)
  try {
    return require(`${prefix}/${collectionName}.model`).default
  } catch( err ) {
    return null
  }
}

const loadDescription = (collectionName: string, internal: boolean) => {
  const prefix = getPrefix(collectionName, internal)
  const isValid = !collectionName.startsWith('_'),
    isJson = isValid && existsSync(`${prefix}/${collectionName}.description.json`),
    path = require.resolve(`${prefix}/${collectionName}.description${isJson ? '.json' : ''}`)

  if( !isValid ) {
    return null
  }
  
  return isJson
    ? require(path)
    : require(path)[collectionName[0].toUpperCase() + collectionName.slice(1) + 'Description']
}

const loadFunction = (functionPath: FunctionPath, entityType: EntityType = 'collection', internal: boolean = false) => {
  const [entityName] = functionPath.split('@')
  const prefix = getPrefix(entityName, internal, entityType)

  return require(`${prefix}/functions/${functionPath}`).default
}

export const getEntityAsset = <Type extends AssetType>(
  assetName: Type extends 'function'
    ? FunctionPath
    : string,
  assetType: AssetType,
  entityType: EntityType = 'collection'
): AssetReturnType<Type> => {
  return cacheIfPossible(
    assetName,
    assetType,
    () => {
      const entityName = assetType === 'function'
        ? assetName.split('@').shift()!
        : assetName

      const internal = isInternal(entityName, entityType)

      switch( assetType ) {
        case 'model': return loadModel(assetName, internal)
        case 'description': return loadDescription(assetName, internal)
        case 'function': {
          try {
            return loadFunction(assetName as FunctionPath, entityType, internal)
          } catch( e: any ) {
            if( e.code !== 'MODULE_NOT_FOUND' ) {
              throw e
            }

            const [, functionName] = assetName.split('@')
            const fn: ApiFunction<unknown> = (props, token, context) => {
              return useCollection(entityName, context)[functionName](props, token)
            }

            return fn
          }
        }
      }
    }
  )
}

export const getEntityFunction = (functionPath: FunctionPath, entityType: EntityType = 'collection') => {
  return getEntityAsset<'function'>(functionPath, 'function', entityType)
}
