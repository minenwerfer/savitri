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

    const result: any = {
      type: String,
      select: value.hidden !== true,
      unique: value.unique === true,
      default: value.default,
      required: value.required || false,
      autopopulate: (typeof value.module === 'string' && !value.preventPopulate) || false,
    }

    const typeMatch = typeMapping.find( ([keys, _]: [string[], any]) => keys.includes(value.type) )

    if( typeMatch ) {
      result.type = typeMatch[1]
    }

    if( typeof value.module === 'string' ) {
      result.ref = value.module.capitalize()
      result.type = value.array
        ? [ObjectId]
        : ObjectId
    }

    if( ['checkbox', 'radio', 'select'].includes(value.type) ) {
      result.validator = (v: string) => value.values.include(v)
    }

    return {
      ...a,
      [key]: result
    }
  }


  return new Schema<T>(Object.entries(fields).filter(([, field]: [unknown, any]) => !field.meta).reduce(convert, extra), options)

}
