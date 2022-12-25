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
import { getEntityAsset } from '../assets'
import { preloadDescription, applyPreset } from './preload'
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
    } = getReferencedCollection(property)||{}

    const required = description.strict || description.required?.includes(propertyName)

    const result: Record<string, any> = {
      type: String,
      unique: property.s$unique === true,
      default: (() => {
        if( property.default ) {
          return property.default
        }

        if( property.type === 'array' ) {
          return []
        }
      })(),
      required
    }

    if( property.s$hidden ) {
      result.select = false
    }

    const type = getTypeConstructor(property)
    result.type = type

    if( typeof referencedCollection === 'string' ) {
      const refDescription = getEntityAsset(referencedCollection, 'description')

      hasRefs = true
      const actualReferenceName = result.ref = refDescription.alias || refDescription.$id
      getEntityAsset(actualReferenceName, 'model')

      if( !property.s$preventPopulate ) {
        const join = (value: string|Array<string>) => Array.isArray(value)
          ? value.join(' ')
          : value

        result.autopopulate = {
          maxDepth: (() => {
            if( reference.s$maxDepth === 0 ) {
              return 10
            }

            return reference.s$maxDepth || 2
          })(),
          select: reference.s$select && join(reference.s$select)
        }
      }
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
  _description: MaybeCollectionDescription,
  config?: {
    options?: SchemaOptions|null,
    modelCallback?: ((structure: SchemaStructure) => void)|null,
    schemaCallback?: (schema: Schema) => void
  }
) => {
  const description = preloadDescription(_description)

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

  const cascadingDelete: Array<{
    propertyName: string
    collectionName: string
    array: boolean
  }> = []

  for( const [propertyName, property] of Object.entries(description.properties) ) {
    if( property.s$isFile || property.s$inline ) {
      const referenceDescription = getEntityAsset(property.s$referencedCollection!, 'description')
      cascadingDelete.push({
        propertyName,
        collectionName: referenceDescription.alias || referenceDescription.$id,
        array: property.type === 'array'
      })
    }
  }

  const purge = async (doc: any) => {
    for( const subject of cascadingDelete ) {
      const model = mongooseModel(subject.collectionName)
      if( subject.array ) {
        await model.deleteMany({
          _id: {
            $in: doc[subject.propertyName]
          }
        })
        continue
      }

      await model.deleteOne({
        _id: doc[subject.propertyName]
      })
    }
  }

  if( cascadingDelete.length > 0 ) {
    const cascadingDeleteProjection = cascadingDelete.reduce((a, { propertyName }) => ({
      ...a,
      [propertyName]: 1
    }), {})

    schema.post('findOneAndDelete', async function(doc) {
      await purge(doc)
    })

    schema.pre('deleteOne', async function() {
      const doc = await this.model
        .findOne(this.getQuery(), cascadingDeleteProjection)
        .lean()

      await purge(doc)
    })

    schema.pre('deleteMany', async function() {
      const results = await this.model
        .find(this.getQuery(), cascadingDeleteProjection)
        .lean()

      for( const doc of results ) {
        await purge(doc)
      }
    })
  }

  if( schemaCallback ) {
    schemaCallback(schema)
  }

  return mongooseModel<T>(modelName, schema)
}
