import * as R from 'ramda'
import type { CollectionDescription } from '../../../types'
import type { MongoDocument } from '../../types'

export const normalizeProjection = <T>(projection?: Array<keyof T>|Record<keyof T, number>) => {
  if( Array.isArray(projection) ) {
    return projection.reduce((a, key) => ({ ...a, [key]: 1 }), {})
  }

  return projection || {}
}

export const fill = <T extends MongoDocument>(
  item: T & Record<string, any>,
  description: Pick<CollectionDescription, 'properties'>
) => {
  if( !item ) {
    return {}
  }

  const missing = Object.entries(description.properties).reduce((a: any, [key, value]) => {
    if( item[key] && !value.s$meta ) {
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
  description: Pick<CollectionDescription, 'properties' | 'form' | 'writable'>
) => {
  const {
    _id,
    created_at,
    updated_at,
    ...rest

  } = payload

  const forbidden = (key: string) => {
    return description.properties[key]?.readOnly
      || (description.writable && !description.writable.includes(key)
    )
  }
  const prepareUpdate = () => Object.entries(rest as Record<string, any>).reduce((a: any, [key, value]) => {
    if( forbidden(key) ) {
      return a
    }

    if( ( [undefined, null].includes(value) || R.isEmpty(value) ) && !Array.isArray(value) ) {
      a.$unset[key] = 1
      return a
    }

    a.$set[key] = value
    return a

  }, {
    $set: {},
    $unset: {}
  })

  const prepareCreate = () => Object.entries(rest as Record<string, any>).reduce((a: any, [key, value]) => {
    if( forbidden(key) ) {
      return a
    }

    return {
      ...a,
      [key]: value
    }
  }, {})

  const what = typeof _id === 'string'
    ? prepareUpdate()
    : prepareCreate()

  Object.keys(what).forEach(k => {
    if( R.isEmpty(what[k]) ) {
      delete what[k]
    }
  })

  return what
}
