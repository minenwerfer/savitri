import {
  model as mongooseModel,
  models as mongooseModels,
  Model,
  Schema,
  SchemaOptions,

} from 'mongoose'

import * as R from 'ramda'
import * as TypeGuards from './typeguards'
import { getReferencedCollection } from '../../../common'
import type { CollectionDescription, CollectionProperty, MaybeCollectionDescription } from '../../../types'

import { options as defaultOptions } from '../database'
import { applyPreset } from './preload'
import { getTypeConstructor } from './typemapping'
// import { v1 as uuidv1 } from 'uuid'
//
type SchemaStructure = Record<string, Record<string, any>>

export const descriptionToSchemaObj = (description: MaybeCollectionDescription) => {
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
    }

    if( property.enum ) {
      result.enum = property.enum
    }

    return {
      ...a,
      [propertyName]: result
    }
  }

  // const initial = {
    // _id: {
    //   type: String,
    //   default: uuidv1
    // }
    // domain_id: {
    //   type: ObjectId,
    //   required: true
    // }
  // }

  if( !description.properties ) {
    throw new TypeError(
      `description doesnt have properties set`
    )
  }

  if( description.presets ) {
    description.properties = description.presets?.reduce((a: CollectionDescription, presetName) => {
      return applyPreset(a, presetName, 'properties')

    }, description.properties as CollectionDescription)
  }

  const schemaStructure = Object.entries(description.properties)
    .reduce(convert, {})

  return {
    schemaStructure,
    hasRefs
  }
}

export const descriptionToSchema = <T>(
  description: MaybeCollectionDescription,
  options: SchemaOptions = {},
  cb?: ((structure: SchemaStructure) => void)|null
) => {
  const {
    schemaStructure,
    hasRefs

  } = descriptionToSchemaObj(description)

  if( cb ) {
    cb(schemaStructure)
  }

  const schema = new Schema<T>(schemaStructure, options)
  if( hasRefs ) {
    schema.plugin(require('mongoose-autopopulate'))
  }

  schema.plugin(require('mongoose-lean-getters'))
  schema.plugin(require('mongoose-lean-virtuals'))

  return schema
}

export const createModel = <T=any>(
  description: MaybeCollectionDescription,
  config?: {
    options?: SchemaOptions|null,
    modelCallback?: ((structure: SchemaStructure) => void)|null,
    schemaCallback?: (schema: Schema) => void
  }
) => {
  const {
    options,
    modelCallback,
    schemaCallback
  } = config||{}

  const modelName = description.$id.split('/').pop() as string
  if( mongooseModels[modelName] ) {
    return mongooseModels[modelName] as Model<T>
  }

  const schema = descriptionToSchema<T>(description, options || defaultOptions, modelCallback)
  if( schemaCallback ) {
    schemaCallback(schema)
  }

  return mongooseModel<T>(modelName, schema)
}
