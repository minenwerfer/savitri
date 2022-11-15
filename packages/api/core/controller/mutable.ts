import * as R from 'ramda'
import type { Model } from '../database'
import type { CollectionDescription } from '../../../common/types'
import type { MongoDocument } from '../../types'

import { fromEntries, deepMerge } from '../../../common/helpers'
import { ItemNotFound } from '../exceptions'
import * as baseControl from '../access/baseControl'

import { normalizeProjection, fill, prepareInsert } from '../collection'
import { Controller } from './controller'

export abstract class Mutable<T extends MongoDocument> extends Controller {
  declare protected readonly description: CollectionDescription

  protected _queryPreset: {
    filters: any
    sort: any
  }

  constructor(
    public readonly model: Model<T>,
    description: unknown,
    readonly options:any = {}
  ) {
    super({ ...options, description })
    this.description = description as CollectionDescription

    if( this.description.options ) {
      Object.assign(this.options, this.description.options)
    }
  }

  private beforeRead(payload: any, decodedToken: any) {
    const newPayload = Object.assign({}, {
      filters: payload?.filters||{},
      sort: payload?.sort,
      limit: payload?.limit
    })

    if( this.options.queryPreset ) {
      deepMerge(
        newPayload,
        this.options.queryPreset
      )
    }

    if( this.apiConfig.beforeRead && decodedToken ) {
      deepMerge(
        newPayload,
        this.apiConfig.beforeRead(decodedToken, this.description.$id)
      )
    }

    deepMerge(
      newPayload,
      baseControl.beforeRead!(decodedToken, this.description.$id)
    )

    if( newPayload.limit > 150 ) {
      newPayload.limit = 150
    }

    return newPayload
  }

  private beforeWrite(payload: any, decodedToken: any) {
    const newPayload = Object.assign({ what: {} }, payload)
    const filters = newPayload.what || {}

    if( this.apiConfig.beforeWrite && decodedToken ) {
      deepMerge(
        filters,
        this.apiConfig.beforeWrite(decodedToken, this.description.$id)
      )
    }

    deepMerge(
      filters,
      baseControl.beforeWrite!(decodedToken, this.description.$id)
    )

    return newPayload
  }

  public async _insert(
    props: { what: Partial<T> },
    decodedToken?: any,
    _response?: unknown
  ): Promise<any> {
    const { _id } = props.what

    const { what } = this.beforeWrite(props, decodedToken)
    const readyWhat = prepareInsert(what, this.description)

    if( !_id ) {
      const newDoc = await this.model.create(readyWhat)
      return this.model.findOne({ _id: newDoc._id })
    }

    return this.model.findOneAndUpdate(
      { _id }, readyWhat,
      { new: true, runValidators: true }
    )
  }

  public async insert(props: { what: Partial<T> }, decodedToken?: any) {
    const result = await this._insert(props, decodedToken)
    return fill(result?._doc||result, this.description)
  }

  public count(props?: { filters?: object }, decodedToken?: any) {
    const query = this.beforeRead(props, decodedToken)
    return this.model.countDocuments(query.filters)
  }

  public async get(
    props: {
      filters?: object,
      project?: string|Array<string>
    },
    _decodedToken?: any,
    _response?: unknown
  ): Promise<T> {
    if( !props?.filters ) {
      throw new Error('no filter specified')
    }

    const pipe = R.pipe(
      (item: T & { _doc?: T }) => {
        if( !item ) {
          throw new ItemNotFound('item not found')
        }

        return item._doc||item
      },
      (item: T) => item && fill(item, this.description),
    )

    const result = await this.model.findOne(props.filters, normalizeProjection(props.project))
    return pipe(result as T)
  }

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
      props.limit = +(process.env.PAGINATION_LIMIT||35)
    }

    const entries = Object.entries(props.filters||{})
      .map(([key, value]: [string, any]) => [
        key,
        value && typeof value === 'object' && 'id' in value ? value._id : value
      ])

    const filters = fromEntries(entries) || {}
    const query = this.beforeRead({ filters }, decodedToken)

    const sort = query.sort
      ? query.sort
      : props.sort || defaultSort

    return this.model.find(query.filters, normalizeProjection(props.project))
      .sort(sort)
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
     (item: T) => !props.project
      ? fill(item, this.description)
      : item
   )

   return result.map(pipe)
  }

  public delete(props: { filters: any }, decodedToken?: any): any | Promise<any> {
    if( !props.filters ) {
      throw new Error('no criteria specified')
    }
    
    const query = this.beforeRead(props, decodedToken)
    return this.model.findOneAndDelete(query.filters, { strict: 'throw' })
  }

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

  public modify(props: { filters: any, what: any }, decodedToken?: any): any | Promise<any> {
    const { what, filters } = this.beforeWrite(props, decodedToken)
    const readyWhat = prepareInsert(what, this.description)

    return this.model.findOneAndUpdate(filters, readyWhat, { new: true, runValidators: true })
  }

  public modifyAll(props: { filters: Array<any>, what: any }, decodedToken?: any) {
    const { what, filters } = this.beforeWrite(props, decodedToken)
    const readyWhat = prepareInsert(what, this.description)

    return this.model.updateMany(filters.filters, readyWhat)
  }
}
