import { model as mongooseModel, Schema } from 'mongoose'
import * as R from 'ramda'
import * as TypeGuards from './typeguards'
import type { CollectionDescription, MaybeCollectionDescription } from '../../../common'
import { options as defaultOptions } from '../database'
import { applyPreset } from './preload'
// import { v1 as uuidv1 } from 'uuid'
const { ObjectId } = Schema.Types

const typeMapping: Array<[Array<string>, any]> = [
  [
    [
      'text',
      'password',
      'radio',
      'select'
    ],
    String
  ],
  [
    [
      'number',
      'integer'
    ],
    Number
  ],
  [ ['checkbox'], [String] ],
  [ ['object'], Object ],
  [ ['boolean'], Boolean ],
  [ ['datetime'], Date ]
]

/**
 * @exports @function
 * Converts a description object into a mongoose Schema structure.
 */
export const descriptionToSchema = <T>(
  description: MaybeCollectionDescription,
  options = {},
  extra: any = {}
) => {
  R.pipe(
    TypeGuards.presets,
    TypeGuards.fields,
    TypeGuards.actions
  )(description)

  let hasRefs = false

  const convert = (a: any, [key, field]: [string, any]) => {
    if( field.meta ) {
      return a
    }

    const query = Array.isArray(field.values||[])
      ? (field.values||[{}])[0]?.__query
      : field.values?.__query

    const {
      collection: collectionName,
      ...reference
    } = query || field

    const result: any = {
      type: String,
      unique: field.unique === true,
      default: field.default,
      required: field.required !== false
        ? field.required || description.strict
        : false
    }

    if( field.hidden ) {
      result.select = false
    }

    if( typeof collectionName === 'string' && !field.preventPopulate ) {
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

    const typeMatch = typeMapping.find(([keys, _]) => keys.includes(field.type) )
    if( typeMatch ) {
      result.type = typeMatch[1]
    }

    if( typeof collectionName === 'string' ) {
      hasRefs = true

      result.ref = collectionName
      result.type = field.array || Array.isArray(field.values)
        ? [ObjectId]
        : ObjectId

      if( field._id === false ) {
        result.type = field.array
          ? [Object]
          : Object
      }
    }

    if( ['checkbox', 'radio', 'select'].includes(field.type) ) {
      result.validator = (v: string) => field.values.include(v)
    }

    if( ['text'].includes(field.type) && field.required ) {
      result.validator = (v: string) => !!v && v.length > 0
    }

    return {
      ...a,
      [key]: result
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
    description.fields = description.presets?.reduce((a: CollectionDescription, presetName: string) => {
      return applyPreset(a, presetName, 'fields')

    }, description.fields as CollectionDescription)
  }

  const schemaStructure = Object.entries(description.fields||{})
    .reduce(convert, { ...extra, ...initial })

  const schema = new Schema<T>(schemaStructure, options)
  if( hasRefs ) {
    schema.plugin(require('mongoose-autopopulate'))
  }

  return schema
}

export const createModel = <T=any>(
  modelName: string,
  description: MaybeCollectionDescription,
  options?: any,
  cb?: (schema: Schema) => void
) => {
  const schema = descriptionToSchema<T>(description, options || defaultOptions)
  if( cb ) {
    cb(schema)
  }

  return mongooseModel<T>(modelName, schema)
}
