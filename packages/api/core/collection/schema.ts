import {
  model as mongooseModel,
  models as mongooseModels,
  Model,
  Schema

} from 'mongoose'

import * as R from 'ramda'
import * as TypeGuards from './typeguards'
import { getReferencedCollection } from '../../../common'
import type { CollectionDescription, CollectionProperty, MaybeCollectionDescription } from '../../../types'

import { options as defaultOptions } from '../database'
import { applyPreset } from './preload'
import { getTypeConstructor } from './typemapping'
// import { v1 as uuidv1 } from 'uuid'
const { ObjectId } = Schema.Types

export const descriptionToSchema = <T>(
  description: MaybeCollectionDescription,
  options = {},
  extra: any = {}
) => {
  R.pipe(
    TypeGuards.presets,
    TypeGuards.properties,
    TypeGuards.actions
  )(description)

  let hasRefs = false

  const convert = (a: any, [propertyName, property]: [string, CollectionProperty]) => {
    if( property.s$meta ) {
      return a
    }

    const {
      $ref: referencedCollection,
      ...reference
    } = getReferencedCollection(property) as any||{}

    const required = description.strict || description.required?.includes(propertyName)

    const result: any = {
      type: String,
      unique: property.s$unique === true,
      default: property.default,
      required
    }

    if( property.s$hidden ) {
      result.select = false
    }

    if( typeof referencedCollection === 'string' && !property.s$preventPopulate ) {
      const join = (value: string|Array<string>) => Array.isArray(value)
        ? value.join(' ')
        : value

      result.autopopulate = {
        maxDepth: reference.maxDepth || 2,
        select: reference.select
          ? join(reference.select)
          : join(reference.index)
      }
    }

    const type = getTypeConstructor(property)
    result.type = type

    if( typeof referencedCollection === 'string' ) {
      hasRefs = true
      result.ref = referencedCollection
      result.type = property.s$noId
        ? Object
        : ObjectId
    }

    if( property.enum ) {
      result.enum = property.enum
    }

    return {
      ...a,
      [propertyName]: result
    }
  }

  const initial = {
    // _id: {
    //   type: String,
    //   default: uuidv1
    // }
    // domain_id: {
    //   type: ObjectId,
    //   required: true
    // }
  }

  if( description.presets ) {
    description.properties = description.presets?.reduce((a: CollectionDescription, presetName) => {
      return applyPreset(a, presetName, 'properties')

    }, description.properties as CollectionDescription)
  }

  const schemaStructure = Object.entries(description.properties||{})
    .reduce(convert, { ...extra, ...initial })

  const schema = new Schema<T>(schemaStructure, options)
  if( hasRefs ) {
    schema.plugin(require('mongoose-autopopulate'))
  }

  return schema
}

export const createModel = <T=any>(
  description: MaybeCollectionDescription,
  options?: any,
  cb?: (schema: Schema) => void
) => {
  const modelName = description.$id.split('/').pop() as string
  if( mongooseModels[modelName] ) {
    return mongooseModels[modelName] as Model<T>
  }

  const schema = descriptionToSchema<T>(description, options || defaultOptions)
  if( cb ) {
    cb(schema)
  }

  return mongooseModel<T>(modelName, schema)
}
