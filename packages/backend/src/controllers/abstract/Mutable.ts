import { Model, Document, Query, FilterQuery, UpdateQuery } from '../../database'
import { Controller } from './Controller'

import { fromEntries } from '../../../../common/src/helpers'

export const { PAGINATION_LIMIT } = process.env

export type SingleQuery<T> = Query<(T & { _id: any; }), T & { _id: any; }, {}, T>;
export type MultipleQuery<T> = Query<(T & { _id: any; })[], T & { _id: any; }, {}, T>;

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
  public insert(props: { what: T & { _id?: string } }, response?: unknown, token?: any): any | Promise<any> {
    const { _id, ...rest } = props.what
    const what = typeof _id === 'string' ? Object.entries(rest).reduce((a: any, [key, value]: [string, any]) => {

      const result = a
      const append = value && typeof value === 'object' && Object.keys(value).length === 0
        ? '$unset' : '$set'

      a[append][key] = value
      return a

    }, {
      $set: {},
      $unset: {}
    }) : rest

    Object.keys(what)
      .filter(k => typeof what[k] === 'object' && Object.keys(what[k]).length === 0)
      .forEach(k => delete what[k])

    return typeof _id !== 'string'
      ? this._model.create(what)
      : this._model.findOneAndUpdate({ _id } as FilterQuery<T>, what as UpdateQuery<T>, { new: true, runValidators: true })
  }

  public count(props: { filters?: object }) {
    return this._model.countDocuments(props?.filters || {})
  }

  /**
   * @method
   * Gets a document from database.
   */
  public get(props: { filters?: object }): any | Promise<any> {
    return this._model.findOne(props.filters)
  }

  /**
   * @method
   * Gets a collection of documents from database.
   */
  public getAll(props: { filters?: object, offset?: number, limit?: number, sort?: any }): MultipleQuery<T> | Promise<MultipleQuery<T>> {
    const defaultSort = {
      created_at: -1,
      date_updated: -1,
      date_created: -1,
    }

    if( typeof props.limit !== 'number' ) {
      props.limit = +(PAGINATION_LIMIT||35)
    }

    const entries = Object.entries(props.filters||{})
      .map(([key, value]: [string, any]) => [key, typeof value === 'object' && 'id' in value ? value._id : value])

    props.filters = fromEntries(entries)

    return this._model.find(props.filters||{})
      .sort(props.sort || defaultSort)
      .skip(props.offset || 0)
      .limit(props.limit)
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
