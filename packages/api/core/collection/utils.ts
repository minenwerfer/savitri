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
  _item: T,
  description: Pick<CollectionDescription, 'fields'>
) => {
  const { _id, ...item } = _item

  const entries = Object.entries(item)
    .map(([key, value]: [string, any]) => ([
      key,
      !description.fields[key]?.inline && !!value?._id
        ? select(value, getIndexes(description, key))
        : value
    ]))

  return {
    _id,
    ...fromEntries(entries)
  }
}

export const depopulateChildren = <T extends MongoDocument>(item: T, minDepth:number=1) => {
  const depopulate = (_item:any) => {
    const item = _item?._doc||_item
    if( !item || !item._id ) {
      return item
    }

    return fromEntries(Object.entries(item)
      .map(([key, value]: [string, any]) => [
        key,
        value?._id ? value._id : value
      ]))
  }

  const recurse = (_item:any, depth:number=0): any => {
    const item = _item?._doc||_item//
    if( !item || !item._id ) {
      return item
    }

    if( depth >= minDepth ) {
      const { _id, ...doc } = item
      const entries = Object.entries(doc)
        .map(([key, value]: [string, any]) => [
          key,
          Array.isArray(value)
            ? value.map((v: any) => depopulate(v))
            : depopulate(value)
        ])

      return {
        _id,
        ...fromEntries(entries)
      }
    }

    const { _id, ...doc } = item
    return Object.entries(doc).reduce((a, [key, value]) => {
      return {
        ...a,
        [key]: Array.isArray(value)
          ? value.map((v: any) => recurse(v, depth+1))
          : recurse(value, depth+1)
      }
    }, { _id: item._id })
  }

  return recurse(item)
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
