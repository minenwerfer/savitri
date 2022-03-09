import { Model, Document, Query, FilterQuery, UpdateQuery } from '../../database'
import { Controller } from './Controller'

import { fromEntries } from '../../../../common/src/helpers'
import { getIndexes } from '../../../../common/src/entity'

export const { PAGINATION_LIMIT } = process.env

export type SingleQuery<T> = Query<(T & { _id: any; }), T & { _id: any; }, {}, T>;
export type MultipleQuery<T> = Query<(T & { _id: any; })[], T & { _id: any; }, {}, T>;

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

export abstract class Mutable<T> extends Controller<T> {
  /**
   * @constructor
   * @param {Model<T>} model - a singleton instance of Model<T>
   */
  constructor(model: Model<T>, description: object, options = {}) {
    super({ description, ...options })
    this._model = model;
  }

  /**
   * @method
   * Inserts a single document in the database.
   */
  public async insert(props: { what: T & { _id?: string } }, response?: unknown, decodedToken?: any): Promise<any> {

    const { _id, ...rest } = props.what

    const forbidden = (key: string) => {
      return (this._description.fields[key]||{}).readonly
        || (this._description.form && this._description.form.includes(key))
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

    if( typeof _id !== 'string' ) {
      const newDoc = await this._model.create(what)
      return this._model.findOne({ _id: newDoc._id })
    }

    return this._model.findOneAndUpdate(
      { _id } as FilterQuery<T>,
      what as UpdateQuery<T>,
      { new: true, runValidators: true }
    )
  }

  public count(props: { filters?: object }) {
    return this._model.countDocuments(props?.filters || {})
  }

  /**
   * @method
   * Gets a document from database.
   */
  public get(props: { filters?: object }, response?: unknown, decodedToken?: any): any | Promise<any> {
    return this._model.findOne(props?.filters)
  }

  /**
   * @method
   * Gets a collection of documents from database.
   */
  protected _getAll(props: { filters?: object, offset?: number, limit?: number, sort?: any }): MultipleQuery<T> {
    const defaultSort = {
      date_updated: -1,
      date_created: -1,
      created_at: -1,
    }

    if( typeof props.limit !== 'number' ) {
      props.limit = +(PAGINATION_LIMIT||35)
    }

    const entries = Object.entries(props.filters||{})
      .map(([key, value]: [string, any]) => [key, value && typeof value === 'object' && 'id' in value ? value._id : value])

    props.filters = fromEntries(entries)

    return this._model.find(props.filters||{})
      .sort(props.sort || defaultSort)
      .skip(props.offset || 0)
      .limit(props.limit)
  }

  public async getAll(props: { filters?: object, offset?: number, limit?: number, sort?: any }, response?: unknown, decodedToken?: any) {
    return (await this._getAll(props))
      .map((item: T) => depopulate(item, this._description))
      .map((item: T) => depopulateChildren(item))
  }

  /**
   * @method
   * Removes a document from database.
   */
  public remove(props: { filters: any }): any | Promise<any> {
    if( !props.filters ) {
      throw new Error('no criteria specified')
    }
    return this._model.findOneAndDelete(props.filters, { strict: 'throw' })
  }

  /**
   * @method
   * Removing all documents from database matching the criteria.
   */
  public removeAll(props: { filters: any }) {
    if( !Array.isArray(props.filters?._id) || props.filters?._id?.length === 0 ) {
      throw new Error('no criteria specified')
    }
    return this._model.deleteMany(props.filters as FilterQuery<T>, { strict: 'throw' })
  }

  /**
   * @method
   * Modify a single document.
 */
  public modify(props: { filters: any, what: any }): any | Promise<any> {
    return this._model.findOneAndUpdate(props.filters as FilterQuery<T>, props.what, { new: true, runValidators: true })
  }

  /**
   * @method
   * Modify documents matching criteria.
   */
  public modifyAll(props: { filters: any[], what: any }) {
    return this._model.updateMany(props.filters as FilterQuery<T>, props.what)
  }
}
