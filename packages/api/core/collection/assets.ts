import type { Model } from 'mongoose'
import { existsSync } from 'fs'
import * as SystemCollections from '../../../system/collections'

type AssetType =
  'model'
  | 'description'

const __cached: Record<AssetType, Record<string, any>> = {
  model: {},
  description: {}
}

const isInternal = (collectionName: string): boolean => {
  return collectionName in SystemCollections
}

const getPrefix = (collectionName: string, internal: boolean ) => {
  return internal
    ? `${process.cwd()}/collections/${collectionName}`
    : `${__dirname}/../../../system/collections/${collectionName}`
}

export const loadModel = (collectionName: string, internal: boolean): Model<any>|null => {
  const prefix = getPrefix(collectionName, internal)
  try {
    return require(`${prefix}/${collectionName}.model`)
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
    : require(path)[collectionName[0].toUpperCase() + collectionName.slice(1)]
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
