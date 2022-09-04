import * as R from 'ramda'
import * as TypeGuards from '../collection/typeguards'
import type { Model } from '../database'
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
  }

  private beforeRead(payload: any, decodedToken: any) {
    const newPayload = Object.assign({}, {
      filters: payload?.filters||{},
      sort: payload?.sort||{}
    })

    if( this.options.queryPreset ) {
      Object.assign(
        newPayload,
        this.options.queryPreset
      )
    }

    if( this.apiConfig.beforeRead && decodedToken ) {
      Object.assign(
        newPayload.filters,
        this.apiConfig.beforeRead(decodedToken, this.description.collection)
      )
    }

    return newPayload
  }

  private beforeWrite(payload: any, decodedToken: any) {
    const newPayload = Object.assign({ what: {} }, payload)
    const filters = newPayload.what || {}

    if( this.apiConfig.beforeWrite && decodedToken ) {
      Object.assign(
        filters,
        this.apiConfig.beforeWrite(decodedToken, this.description.collection)
      )
    }

    return newPayload
  }

  /**
   * @method
   * Inserts a single document in the database.
   */
  public async insert(
    props: { what: Partial<T> },
    decodedToken?: any,
    _response?: unknown
  ): Promise<any> {
    const { _id } = props.what
    const what = prepareInsert(this.description, props.what)
    const readyWhat = this.beforeWrite(what, decodedToken)

    if( !_id ) {
      const newDoc = await this.model.create(readyWhat)
      return this.model.findOne({ _id: newDoc._id })
    }

    return this.model.findOneAndUpdate(
      { _id }, readyWhat,
      { new: true, runValidators: true }
    )
  }

  public count(props?: { filters?: object }, decodedToken?: any) {
    const query = this.beforeRead(props, decodedToken)
    return this.model.countDocuments(query.filters)
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

  }, decodedToken?: any) {

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

    const filters = fromEntries(entries) || {}
    const query = this.beforeRead({ filters }, decodedToken)

    return this.model.find(query.filters)
      .sort({ ...(props.sort || defaultSort), ...query.sort })
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
   decodedToken?: any,
   _response?: unknown
  ) {
   const result: Array<T> = await this._getAll(props, decodedToken)

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
  public delete(props: { filters: any }, decodedToken?: any): any | Promise<any> {
    if( !props.filters ) {
      throw new Error('no criteria specified')
    }
    
    const query = this.beforeRead(props, decodedToken)
    return this.model.findOneAndDelete(query.filters, { strict: 'throw' })
  }

  /**
   * @method
   * Removing all documents from database matching the criteria.
   */
  public deleteAll(props: { filters: any }, decodedToken?: any) {
    if( !Array.isArray(props.filters?._id) || props.filters?._id?.length === 0 ) {
      throw new Error('no criteria specified')
    }

    const { _id, ...rest } = props.filters
    const filters = {
      _id: { $in: props.filters._id },
      ...rest
    }

    const query = this.beforeRead({ filters }, decodedToken)
    return this.model.deleteMany(query.filters, { strict: 'throw' })
  }

  /**
   * @method
   * Modify a single document.
 */
  public modify(props: { filters: any, what: any }, decodedToken?: any): any | Promise<any> {
    const what = prepareInsert(this.description, props.what)
    const query = this.beforeWrite(props, decodedToken)

    return this.model.findOneAndUpdate(query.filters, what, { new: true, runValidators: true })
  }

  /**
   * @method
   * Modify documents matching criteria.
   */
  public modifyAll(props: { filters: Array<any>, what: any }, decodedToken?: any) {
    const what = prepareInsert(this.description, props.what)
    const query = this.beforeWrite(props, decodedToken)

    return this.model.updateMany(query.filters, what)
  }
}
