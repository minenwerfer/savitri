import type { Model } from 'mongoose'
import { existsSync } from 'fs'
import * as SystemCollections from '../../system/collections'
import * as SystemControllables from '../../system/controllables'

type AssetType =
  'model'
  | 'description'
  | 'function'

type FunctionPath = `${string}@${string}`

type EntityType =
  'collection'
  | 'controllable'

const __cached: Record<AssetType, Record<string, any>> = {
  model: {},
  description: {},
  function: {}
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
    ? `${process.cwd()}/${pluralized}/${collectionName}`
    : `${__dirname}/../../system/${pluralized}/${collectionName}`
}

export const loadModel = (collectionName: string, internal: boolean): Model<any>|null => {
  const prefix = getPrefix(collectionName, internal)
  try {
    return require(`${prefix}/${collectionName}.model`).default
  } catch( err ) {
    return null
  }
}

export const loadDescription = (collectionName: string, internal: boolean) => {
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

export const loadFunction = (functionPath: FunctionPath, entityType: EntityType = 'collection', internal: boolean = false) => {
  const [entityName] = functionPath.split('@')
  const prefix = getPrefix(entityName, internal, entityType)

  return require(`${prefix}/functions/${functionPath}`).default
}

export const getCollectionAsset = (collectionName: string, assetType: AssetType) => {
  let asset

  if( __cached[assetType][collectionName] ) {
    return __cached[assetType][collectionName]
  }

  const internal = isInternal(collectionName)

  switch( assetType ) {
    case 'model': asset = loadModel(collectionName, internal); break
    case 'description': asset = loadDescription(collectionName, internal); break
  }

  __cached[assetType][collectionName] = asset
  return asset
}
