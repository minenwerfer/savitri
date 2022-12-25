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
import type { CollectionFunctions } from './collection/functions.types'
import { useCollection, createModel } from './collection'

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
    : require(path).default
}

const loadModel = (collectionName: string, internal: boolean): Model<any>|null => {
  const prefix = getPrefix(collectionName, internal)
  return require(`${prefix}/${collectionName}.model`).default
}

const loadModelWithFallback = (collectionName: string, internal: boolean) => {
  try {
    return loadModel(collectionName, internal)
  } catch( e: any ) {
    if( e.code !== 'MODULE_NOT_FOUND' ) {
      throw e
    }
    
    const description = getEntityAsset(collectionName, 'description')
    return createModel(description)
  }
}

const loadFunction = (functionPath: FunctionPath, entityType: EntityType = 'collection', internal: boolean = false) => {
  const [entityName] = functionPath.split('@')
  const prefix = getPrefix(entityName, internal, entityType)

  const originalFn = require(`${prefix}/functions/${functionPath}`).default
  if( entityType === 'controllable' ) {
    return originalFn
  }

  const fn: ApiFunction<any> = (props, context) => {
    return originalFn(props, {
      ...context,
      collection: useCollection(entityName, context)
    })
  }

  return fn
}

const loadFunctionWithFallback = (functionPath: FunctionPath, entityType: EntityType, internal: boolean) => {
  try {
    return loadFunction(functionPath, entityType, internal)
  } catch( e: any ) {
    if( e.code !== 'MODULE_NOT_FOUND' ) {
      throw e
    }

    const [entityName, functionName] = functionPath.split('@')
    const fn: ApiFunction<unknown> = (props, context) => {
      const description = getEntityAsset(entityName, 'description')
      const actualEntityName = description.alias || description.$id

      const method = useCollection(actualEntityName, context)[functionName as keyof CollectionFunctions]
      if( !method || typeof method !== 'function' ) {
        throw new TypeError(
          `no such function ${functionPath}`
        )
      }

      return method(props)
    }

    return fn
  }
}

export const getEntityAsset = <Type extends AssetType>(
  assetName: Type extends 'function'
    ? FunctionPath
    : string,
  assetType: Type,
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
        case 'description': return loadDescription(assetName, internal)
        case 'model':
          return loadModelWithFallback(assetName, internal)
        case 'function':
          return loadFunctionWithFallback(assetName as FunctionPath, entityType, internal)
      }
    }
  )
}

export const getEntityFunction = (functionPath: FunctionPath, entityType: EntityType = 'collection') => {
  return getEntityAsset(functionPath, 'function', entityType)
}
