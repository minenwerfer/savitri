import * as R from 'ramda'
import { fromEntries, getIndexes } from '../../../common'
import type { CollectionDescription } from '../../../common/types'
import type { MongoDocument } from '../../types'

export const select = <T extends MongoDocument>(item: T, indexes: Array<string>) => {
  if( !indexes ) {
    return item
  }

  const sanitizedIndexes = [ '_id', ...Array.isArray(indexes) ? indexes : [indexes] ]
  const _select = (what: any) => sanitizedIndexes.reduce((a: any, c: string) => ({ ...a, [c]: what[c] }), {})

  return Array.isArray(item)
    ? item.map((o: any) => _select(o))
    : _select(item)
}

export const depopulate = <T extends MongoDocument>(
  description: Pick<CollectionDescription, 'fields'>,
  _item: T
) => {
  const { _id, ...item } = _item

  const entries = Object.entries(item)
    .map(([key, value]: [string, any]) => ([
      key,
      !description.fields[key]?.expand && !!value?._id
        ? select(value, getIndexes(description, key))
        : value
    ]))

  return {
    _id,
    ...fromEntries(entries)
  }
}

export const depopulateChildren = <T extends { _id: string  }>(item: T) => {
  const depopulate = (item: any) => {
    if( !item || typeof item !== 'object' || !('_id' in item) ) {
      return item
    }

    return fromEntries(Object.entries(item._doc || item)
      .map(([key, value]: [string, any]) => [key, value?._id ? value._id : value]))
  }

  const { _id, ...doc } = item
  const entries = Object.entries(doc)
    .map(([key, value]: [string, any]) => [
      key,
      !Array.isArray(value)
        ? depopulate(value)
        : value.map((v: any) => depopulate(v))
    ])

  return {
    _id,
    ...fromEntries(entries)
  }
}

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

  (Array.isArray(props) ? props : [props])
    .forEach((field: string) => {
      obj[field] = item[field]
    })

  return obj
}

export const fill = <T extends MongoDocument>(
  description: Pick<CollectionDescription, 'fields'>,
  item: T & Record<string, any>
) => {
  if( !item ) {
    return {}
  }

  const missing = Object.entries(description.fields)
      .filter(([key, value]: [string, any]) => !item[key] && !value.meta)
      .map(([key, ]: [string, unknown]) => key)
      .reduce((a: any, b: string) => ({
        ...a,
        [b]: null
      }), {})

  return Object.assign(missing, item)
}

export const prepareInsert = (
  description: Pick<CollectionDescription, 'fields' | 'form'>,
  payload: any
) => {
  const {
    _id,
    created_at,
    updated_at,
    ...rest

  } = payload

  const forbidden = (key: string) => {
    return (description.fields[key]||{}).readOnly
      || (description.form && !description.form.includes(key))
  }

  const what = typeof _id === 'string' ? Object.entries(rest)
    .filter(([key]: [string, unknown]) => !forbidden(key))
    .reduce((a: any, [key, value]: [string, any]) => {
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

  Object.keys(what)
    .filter(k => R.isEmpty(what[k]))
    .forEach(k => delete what[k])

  return what
}
