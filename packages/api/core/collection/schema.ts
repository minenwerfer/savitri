import { Schema } from 'mongoose'
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
export const descriptionToSchema = <T>({ strict, fields, ...props }: any, options = {}, extra: any = {}) => {
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
      required: value.required || strict,
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

  props.presets?.forEach((name: string) => {
    applyPreset(fields, name, 'fields')
  })

  const schemaStructure = Object.entries(fields||{})
    .filter(([, field]: [unknown, any]) => !field.meta)
    .reduce(convert, { ...extra, ...initial })

  const schema = new Schema<T>(schemaStructure, options)
  if( hasRefs ) {
    schema.plugin(require('mongoose-autopopulate'))
  }

  return schema
}
