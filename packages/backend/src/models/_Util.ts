import { Schema } from 'mongoose'
const { ObjectId } = Schema.Types

const typeMapping: Array<[string[], any]>= [
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
export const descriptionToSchema = <T>({ fields }: any, options = {}, extra: any = {}) => {

  const convert = (a: any, [key, value]: [string, any]) => {

    const query = Array.isArray(value.values||[])
      ? (value.values||[{}])[0]?.__query
      : value.values?.__query

    const moduleName = query?.module || value.module

    const result: any = {
      type: String,
      select: value.hidden !== true,
      unique: value.unique === true,
      default: value.default,
      required: value.required || false,
      autopopulate: (typeof moduleName === 'string' && !value.preventPopulate) || false,
    }

    const typeMatch = typeMapping.find( ([keys, _]: [string[], any]) => keys.includes(value.type) )

    if( typeMatch ) {
      result.type = typeMatch[1]
    }

    if( typeof moduleName === 'string' ) {
      result.ref = (moduleName as any).capitalize()
      result.type = value.array || Array.isArray(value.values)
        ? [ObjectId]
        : ObjectId
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

  return new Schema<T>(Object.entries(fields).filter(([, field]: [unknown, any]) => !field.meta).reduce(convert, extra), options)
}
