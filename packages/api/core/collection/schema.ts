import { model as mongooseModel, Schema } from 'mongoose'
import * as R from 'ramda'
import * as TypeGuards from './typeguards'
import type { CollectionDescription, MaybeCollectionDescription } from '../../../common'
import { options as defaultOptions } from '../database'
import { applyPreset } from './preload'
// import { v1 as uuidv1 } from 'uuid'
const { ObjectId } = Schema.Types

const typeMapping: Array<[Array<string>, any]> = [
  [ ['text', 'password', 'radio', 'select'], String ],
  [ ['number', 'integer'], Number ],
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
    TypeGuards.fields
  )(description)

  let hasRefs = false

  const convert = (a: any, [key, value]: [string, any]) => {
    const query = Array.isArray(value.values||[])
      ? (value.values||[{}])[0]?.__query
      : value.values?.__query

    const collectionName = query?.collection || value.collection

    const result: any = {
      type: String,
      select: value.hidden !== true,
      unique: value.unique === true,
      default: value.default,
      required: value.required || description.strict,
      autopopulate: (typeof collectionName === 'string' && !value.preventPopulate) || false,
    }

    const typeMatch = typeMapping.find( ([keys, _]: [Array<string>, any]) => keys.includes(value.type) )

    if( typeMatch ) {
      result.type = typeMatch[1]
    }

    if( typeof collectionName === 'string' ) {
      hasRefs = true

      result.ref = collectionName
      result.type = value.array || Array.isArray(value.values)
        ? [ObjectId]
        : ObjectId

      if( value._id === false ) {
        result.type = value.array
          ? [Object]
          : Object
      }
    }

    if( ['checkbox', 'radio', 'select'].includes(value.type) ) {
      result.validator = (v: string) => value.values.include(v)
    }

    if( ['text'].includes(value.type) && value.required ) {
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
    .filter(([, field]: [unknown, any]) => !field.meta)
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
