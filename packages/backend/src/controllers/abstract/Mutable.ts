import { Model, Document, Query, FilterQuery, UpdateQuery } from '../../database'
import { Controller } from './Controller'

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
  public insert(props: { what: T & { _id?: string } }, response: unknown, token: any): any | Promise<any> {
    const { _id, ...rest } = props.what
    const what = typeof _id === 'string' ? Object.entries(rest).reduce((a: any, [key, value]: [string, any]) => {

      const result = a
      const append = typeof value === 'object' && Object.keys(value).length === 0
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

  public count(props: { filter?: object }) {
    return this._model.countDocuments(props?.filter || {})
  }

  /**
   * @method
   * Gets a document from database.
   */
  public get(props: { filter?: object }) {
    return this._model.findOne(props.filter)
  }

  /**
   * @method
   * Gets a collection of documents from database.
   */
  public getAll(props: { filter?: object, offset?: number, sort?: any }): MultipleQuery<T> | Promise<MultipleQuery<T>> {
    const defaultSort = {
      updated_at: -1,
      created_at: -1,
      date_updated: -1,
      date_created: -1,
    }

    return this._model.find(props.filter||{})
      .sort(props.sort || defaultSort)
      .skip(props.offset || 0)
      .limit(+(PAGINATION_LIMIT||0))
  }

  /**
   * @method
   * Removes a document from database.
   */
  public remove(props: { filter: any }): any | Promise<any> {
    if( !props.filter ) {
      throw 'no criteria specified'
    }
    return this._model.findOneAndDelete(props.filter, { strict: 'throw' })
  }

  /**
   * @method
   * Removing all documents from database matching the criteria.
   */
  public removeAll(props: { filter: any }) {
    if( !Array.isArray(props.filter?._id) || props.filter?._id?.length === 0 ) {
      throw 'no criteria specified'
    }
    return this._model.deleteMany(props.filter as FilterQuery<T>, { strict: 'throw' })
  }

  // /**
  //  * @method
  //  * Modify a single document.
  //  */
  // public modify(props: { filter: any[], what: any }) {
  //   return this._model.findOneAndUpdate(props.filter as FilterQuery<T>, props.what, { new: true, runValidators: true })
  // }

  /**
   * @method
   * Modify documents matching criteria.
   */
  public modifyAll(props: { filter: any[], what: any }) {
    return this._model.updateMany(props.filter as FilterQuery<T>, props.what)
  }
}
