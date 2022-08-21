import * as R from 'ramda'
import * as TypeGuards from '../collection/typeguards'
import { Model, Query, FilterQuery, UpdateQuery } from '../database'
import type { CollectionDescription, MaybeCollectionDescription } from '../../../common/types'

import { fromEntries } from '../../../common/helpers'
import type { MongoDocument } from '../../types'

import {
  depopulate,
  depopulateChildren,
  project,
  fill,
  prepareInsert

} from '../collection'

import { Controller } from './controller'

export const { PAGINATION_LIMIT } = process.env

export type SingleQuery<T> = Query<(T & { _id: any }), T & { _id: any }, {}, T>
export type MultipleQuery<T> = Query<(T & { _id: any })[], T & { _id: any }, {}, T>

export abstract class Mutable<T extends MongoDocument> extends Controller {
  declare protected readonly description: CollectionDescription
  protected _queryPreset: {
    filters: any
    sort: any
  }


  /**
   * @constructor
   * @param {Model<T>} model - a singleton instance of Model<T>
   */
  constructor(
    public readonly model: Model<T>,
    description: unknown,
    readonly options:any = {}
  ) {
    R.pipe(
      TypeGuards.presets,
      TypeGuards.fields
    )(description as MaybeCollectionDescription)

    super({ ...options, description })

    this.description = description as CollectionDescription
    this._queryPreset = options.queryPreset || {}
  }

  /**
   * @method
   * Inserts a single document in the database.
   */
  public async insert(
    props: { what: Partial<T> },
    _decodedToken?: any,
    _response?: unknown
  ): Promise<any> {
    const { _id } = props.what
    const what = prepareInsert(this.description, props.what)

    if( typeof _id !== 'string' ) {
      const newDoc = await this.model.create(what)
      return this.model.findOne({ _id: newDoc._id })
    }

    return this.model.findOneAndUpdate(
      { _id } as FilterQuery<T>,
      what as UpdateQuery<T>,
      { new: true, runValidators: true }
    )
  }

  public count(props?: { filters?: object }) {
    const filters = props?.filters || {}
    return this.model.countDocuments({ ...filters, ...this._queryPreset.filters||{} })
  }

  /**
   * @method
   * Gets a document from database.
   */
  public async get(
    props: { filters?: object, project?: string|Array<string> },
    _decodedToken?: any,
    _response?: unknown
  ): Promise<Array<T>> {
    const pipe = R.pipe(
      (item: T & { _doc?: T }) => {
        if( !item ) {
          throw new Error('item not found')
        }

        return item._doc||item
      },
      (item: T|null) => item && project(item, props?.project),
      (item: T|null) => item && fill(this.description, item)
    )

    return pipe(await this.model.findOne(props?.filters) as T)
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
    project?: string|Array<string>,

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

    props.filters = fromEntries(entries) || {}

    return this.model.find({ ...props.filters, ...this._queryPreset.filters||{} })
      .sort({ ...(props.sort || defaultSort), ...this._queryPreset.sort||{} })
      .skip(props.offset || 0)
      .limit(props.limit)
  }

  public async getAll(
    props: {
      filters?: object,
      offset?: number,
      limit?: number,
      sort?: any,
      project?: string|Array<string>,
   },
   _decodedToken?: any,
   _response?: unknown
  ) {
   const result: Array<T> = await this._getAll(props)

   const pipe = R.pipe(
     (item: T & { _doc?: T }) => item._doc || item,
     (item: T) => project(item, props.project),
     (item: T) => depopulate(this.description, item),
     depopulateChildren,
     (item: T) => !props.project
      ? fill(this.description, item)
      : item
   )

   return result.map(pipe)
  }

  /**
   * @method
   * Removes a document from database.
   */
  public delete(props: { filters: any }): any | Promise<any> {
    if( !props.filters ) {
      throw new Error('no criteria specified')
    }
    return this.model.findOneAndDelete(props.filters, { strict: 'throw' })
  }

  /**
   * @method
   * Removing all documents from database matching the criteria.
   */
  public deleteAll(props: { filters: any }) {
    if( !Array.isArray(props.filters?._id) || props.filters?._id?.length === 0 ) {
      throw new Error('no criteria specified')
    }

    const { _id, ...rest } = props.filters
    const filters = {
      _id: { $in: props.filters._id },
      ...rest
    }

    return this.model.deleteMany(filters as FilterQuery<T>, { strict: 'throw' })
  }

  /**
   * @method
   * Modify a single document.
 */
  public modify(props: { filters: any, what: any }): any | Promise<any> {
    const what = prepareInsert(this.description, props.what)
    return this.model.findOneAndUpdate(props.filters as FilterQuery<T>, what, { new: true, runValidators: true })
  }

  /**
   * @method
   * Modify documents matching criteria.
   */
  public modifyAll(props: { filters: Array<any>, what: any }) {
    const what = prepareInsert(this.description, props.what)
    return this.model.updateMany(props.filters as FilterQuery<T>, what)
  }
}
