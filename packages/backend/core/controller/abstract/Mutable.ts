import { Model, Query, FilterQuery, UpdateQuery } from '../../database'
import { Controller } from './Controller'
import { fromEntries } from '../../../../common/src/helpers'

import {
  depopulate,
  depopulateChildren,
  project,
  fill,
  prepareInsert

} from '../../entity'

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
    this._model = model
  }

  /**
   * @method
   * Inserts a single document in the database.
   */
  public async insert(props: { what: T & { _id?: string } }, response?: unknown, decodedToken?: any): Promise<any> {
    const { _id } = props.what
    const what = prepareInsert(this._description, props.what)

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
  public async get(props: { filters?: object, project?: string|string[] }, response?: unknown, decodedToken?: any): Promise<any> {
    return project(fill(await this._model.findOne(props?.filters), this._description.fields), props?.project)
  }

  /**
   * @method
   * Gets a collection of documents from database.
   */
  protected _getAll(props: {
    filters?: object,
    offset?: number,
    limit?: number,
    sort?: any,
    project?: string|string[],

  }) {

    const defaultSort = {
      date_updated: -1,
      date_created: -1,
      created_at: -1,
    }

    if( typeof props.limit !== 'number' ) {
      props.limit = +(PAGINATION_LIMIT||35)
    }

    const entries = Object.entries(props.filters||{})
      .map(([key, value]: [string, any]) => [
        key,
        value && typeof value === 'object' && 'id' in value ? value._id : value
      ])

    props.filters = fromEntries(entries)

    return this._model.find(props.filters||{})
      .sort(props.sort || defaultSort)
      .skip(props.offset || 0)
      .limit(props.limit)
  }

  public async getAll(props: {
    filters?: object,
    offset?: number,
    limit?: number,
    sort?: any,
    project?: string|string[],

 }, response?: unknown, decodedToken?: any) {
   const result = (await this._getAll(props))
    .map((item: T) => project(item, props.project))

   return result
      .map((item: T) => depopulate(item, this._description))
      .map((item: T) => depopulateChildren(item))
      .map((item: T) => props.project ? item : fill(item, this._description.fields))
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

    const { _id, ...rest } = props.filters
    const filters = {
      _id: { $in: props.filters._id },
      ...rest
    }

    return this._model.deleteMany(filters as FilterQuery<T>, { strict: 'throw' })
  }

  /**
   * @method
   * Modify a single document.
 */
  public modify(props: { filters: any, what: any }): any | Promise<any> {
    const what = prepareInsert(this._description, props.what)
    return this._model.findOneAndUpdate(props.filters as FilterQuery<T>, what, { new: true, runValidators: true })
  }

  /**
   * @method
   * Modify documents matching criteria.
   */
  public modifyAll(props: { filters: any[], what: any }) {
    const what = prepareInsert(this._description, props.what)
    return this._model.updateMany(props.filters as FilterQuery<T>, what)
  }
}
