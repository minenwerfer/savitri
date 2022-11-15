import {
  model as mongooseModel,
  models as mongooseModels,
  Model,
  Schema

} from 'mongoose'

import * as R from 'ramda'
import * as TypeGuards from './typeguards'
import {
  getReferencedCollection,
  CollectionDescription,
  MaybeCollectionDescription

} from '../../../common'

import { options as defaultOptions } from '../database'
import { applyPreset } from './preload'
import { typeMapping, arrayedTypes } from './typemapping'
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

  const convert = (a: any, [propertyName, property]: [string, any]) => {
    if( property.meta ) {
      return a
    }

    const {
      $ref: referencedCollection,
      ...reference
    } = getReferencedCollection(property) as any||{}

    const required = property.required !== false && property.type !== 'boolean'
        ? property.required || description.strict
        : description.required?.includes(propertyName)

    const result: any = {
      type: String,
      unique: property.unique === true,
      default: property.default,
      required
    }

    if( property.hidden ) {
      result.select = false
    }

    if( typeof referencedCollection === 'string' && !property.preventPopulate ) {
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

    const typeMatch = Object.entries(typeMapping as Record<string, readonly string[]>)
      .find(([, types]) => types.includes(property.type))?.[0]

    if( typeMatch ) {
      result.type = arrayedTypes.includes(property.type)
        ? [eval(typeMatch)]
        : eval(typeMatch)
    }

    if( typeof referencedCollection === 'string' ) {
      hasRefs = true
      result.ref = referencedCollection
      result.type = property._id === false
        ? Object
        : ObjectId
    }

    if( reference.array ) {
      result.type = [result.type]
    }

    if( ['checkbox', 'radio', 'select'].includes(property.type) ) {
      result.validator = (v: string) => property.values.include(v)
    }

    if( ['text'].includes(property.type) && property.required ) {
      result.validator = (v: string) => !!v && v.length > 0
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
