import { fromEntries } from '../../../common/src/helpers'
import { getIndexes } from '../../../common/src/entity'

export const depopulate = (item: any, description: any) => {
  const entries = Object.entries((item as any)._doc || item)
    .map(([key, value]: [string, any]) => ([
      key,
      !(description.fields[key]||{}).expand
        ? select(value, getIndexes(description, key))
        : value
    ]))

  return fromEntries(entries)
}

export const depopulateChildren = (item: any) => {
  const depopulate = (i: any) => {
    if( !i || typeof i !== 'object' || !('_id' in i) ) {
      return i
    }

    return fromEntries(Object.entries(i._doc || i)
      .map(([key, value]: [string, any]) => [key, value?._id ? value._id : value]))
  }

  const { _id, ...doc } = item._doc || item
  const entries = Object.entries(doc)
    .map(([key, value]: [string, any]) => [key, !Array.isArray(value) ? depopulate(value) : value.map((v: any) => depopulate(v))])

  return {
    _id,
    ...fromEntries(entries)
  }
}

export const select = (obj: any, fields: string[]) => {
  if( !obj || typeof obj !== 'object' || !fields ) {
    return obj
  }

  const sanitizedFields = [ '_id', ...typeof fields === 'object' ? fields : [fields] ]
  const _select = (what: any) => sanitizedFields.reduce((a: any, c: string) => ({ ...a, [c]: what[c] }), {})

  return Array.isArray(obj)
    ? obj.map((o: any) => _select(o))
    : _select(obj)
}

export const project = (item: any, props: any) => {
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

export const fill = (obj: any, fields: any) => {
  if( !obj ) {
    return {}
  }

  const missing = Object.entries(fields)
      .filter(([key, value]: [string, any]) => !obj[key] && !value.meta)
      .map(([key, ]: [string, unknown]) => key)
      .reduce((a: any, b: string) => ({
        ...a,
        [b]: null
      }), {})

  return Object.assign(missing, obj._doc || obj)
}

export const prepareInsert = (description: any, payload: any) => {
  const {
    _id,
    created_at,
    updated_at,
    ...rest

  } = payload

  const forbidden = (key: string) => {
    return (description.fields[key]||{}).readonly
      || (description.form && !description.form.includes(key))
  }

  const what = typeof _id === 'string' ? Object.entries(rest)
    .filter(([key]: [string, unknown]) => !forbidden(key))
    .reduce((a: any, [key, value]: [string, any]) => {
      const append = !value || (typeof value === 'object' ? Object.keys(value||{}).length : String(value).length ) === 0
        ? '$unset' : '$set'

      a[append][key] = append === '$set' ? value : 1
      return a

    }, {
      $set: {},
      $unset: {}
    }) : rest

  Object.keys(what)
    .filter(k => !what[k] || typeof what[k] === 'object' && Object.keys(what[k]).length === 0)
    .forEach(k => delete what[k])

  return what
}
