import * as R from 'ramda'
// import { fromEntries, getIndexes } from '../../../common'
import type { CollectionDescription } from '../../../common/types'
import type { MongoDocument } from '../../types'

export const project = <T extends MongoDocument>(
  item: Record<string, any> & T,
  props: any
) => {
  if( !props ) {
    return item
  }

  const obj: any = {
    _id: item._id
  };

  (Array.isArray(props) ? props : [props]).forEach((field: string) => {
    obj[field] = item[field]
  })

  return obj
}

export const fill = <T extends MongoDocument>(
  item: T & Record<string, any>,
  description: Pick<CollectionDescription, 'fields'>
) => {
  if( !item ) {
    return {}
  }

  const missing = Object.entries(description.fields)
    .reduce((a: any, [key, value]: [string, any]) => {
      if( item[key] && !value.meta ) {
        return a
      }

      return {
        ...a,
        [key]: null
      }
    }, {})

  return Object.assign(missing, item)
}

export const prepareInsert = (
  payload: any,
  description: Pick<CollectionDescription, 'fields' | 'form' | 'writable'>
) => {
  const {
    _id,
    created_at,
    updated_at,
    ...rest

  } = payload

  const forbidden = (key: string) => {
    return !description.writable?.includes(key) && (
      description.fields[key]?.readOnly
      || (description.form && !description.form.includes(key))
    )
  }

  const what = typeof _id === 'string' ? Object.entries(rest)
    .reduce((a: any, [key, value]: [string, any]) => {
      if( forbidden(key) ) {
        return a
      }

      if( [undefined, null].includes(value) || R.isEmpty(value)) {
        a.$unset[key] = 1
        return a
      }

      a.$set[key] = value
      return a

    }, {
      $set: {},
      $unset: {}
    }) : rest

  Object.keys(what).forEach(k => {
    if( R.isEmpty(what[k]) ) {
      delete what[k]
    }
  })

  return what
}
