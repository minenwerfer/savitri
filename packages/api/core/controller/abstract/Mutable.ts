import { Model, Query, FilterQuery, UpdateQuery } from '../../database'
import { Controller } from './Controller'
import type {
  CollectionDescription,
  CollectionField,
  CollectionFieldType,
  CollectionPreset

} from '../../../../common/types'

import { COLLECTION_FIELD_TYPES, COLLECTION_PRESETS } from '../../../../common/types'
import { fromEntries } from '../../../../common/src/helpers'

import {
  depopulate,
  depopulateChildren,
  project,
  fill,
  prepareInsert

} from '../../collection'

export const { PAGINATION_LIMIT } = process.env

export type SingleQuery<T> = Query<(T & { _id: any }), T & { _id: any }, {}, T>
export type MultipleQuery<T> = Query<(T & { _id: any })[], T & { _id: any }, {}, T>

const isValidPreset = (preset?: string): preset is CollectionPreset => {
  return COLLECTION_PRESETS.includes(preset as CollectionPreset)
}

const isValidFieldType = (fieldType?: string): fieldType is CollectionFieldType => {
  return COLLECTION_FIELD_TYPES.includes(fieldType as CollectionFieldType)
}

export abstract class Mutable<T> extends Controller<T> {
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
    model: Model<T>,
    description: unknown,
    readonly options:any = {}
  ) {
    (description as CollectionDescription).presets?.forEach((preset: string) => {
      if( !isValidPreset(preset) ) {
        throw TypeError(
          `invalid preset "${preset}" at "${(description as CollectionDescription).collection}"`
        )
      }
    })

    Object.values((description as CollectionDescription).fields).forEach((_field: unknown) => {
      const field = _field as Pick<CollectionField, 'type' | 'collection'>
      if( !isValidFieldType(field.type) && !field.collection ) {
        console.log(COLLECTION_FIELD_TYPES)
        console.log(field)
        throw TypeError(
          `invalid field type "${field.type} at "${(description as CollectionDescription).collection}"`
        )
      }
    })

    super({ ...options, description })

    this.description = description as CollectionDescription
    this._model = model
    this._queryPreset = options.queryPreset || {}
  }

  /**
   * @method
   * Inserts a single document in the database.
   */
  public async insert(props: { what: T & { _id?: string } }, response?: unknown, decodedToken?: any): Promise<any> {
    const { _id } = props.what
    const what = prepareInsert(this.description, props.what)

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

  public count(props?: { filters?: object }) {
    const filters = props?.filters || {}
    return this._model.countDocuments({ ...filters, ...this._queryPreset.filters||{} })
  }

  /**
   * @method
   * Gets a document from database.
   */
  public async get(props: { filters?: object, project?: string|Array<string> }, response?: unknown, decodedToken?: any): Promise<any> {
    return project(fill(await this._model.findOne(props?.filters), this.description.fields), props?.project)
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

    return this._model.find({ ...props.filters, ...this._queryPreset.filters||{} })
      .sort({ ...(props.sort || defaultSort), ...this._queryPreset.sort||{} })
      .skip(props.offset || 0)
      .limit(props.limit)
  }

  public async getAll(props: {
    filters?: object,
    offset?: number,
    limit?: number,
    sort?: any,
    project?: string|Array<string>,

 }, response?: unknown, decodedToken?: any) {
   const result = (await this._getAll(props))
    .map((item: T) => project(item, props.project))

   return result
      .map((item: T) => depopulate(item, this.description))
      .map((item: T) => depopulateChildren(item))
      .map((item: T) => props.project ? item : fill(item, this.description.fields))
  }

  /**
   * @method
   * Removes a document from database.
   */
  public delete(props: { filters: any }): any | Promise<any> {
    if( !props.filters ) {
      throw new Error('no criteria specified')
    }
    return this._model.findOneAndDelete(props.filters, { strict: 'throw' })
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

    return this._model.deleteMany(filters as FilterQuery<T>, { strict: 'throw' })
  }

  /**
   * @method
   * Modify a single document.
 */
  public modify(props: { filters: any, what: any }): any | Promise<any> {
    const what = prepareInsert(this.description, props.what)
    return this._model.findOneAndUpdate(props.filters as FilterQuery<T>, what, { new: true, runValidators: true })
  }

  /**
   * @method
   * Modify documents matching criteria.
   */
  public modifyAll(props: { filters: Array<any>, what: any }) {
    const what = prepareInsert(this.description, props.what)
    return this._model.updateMany(props.filters as FilterQuery<T>, what)
  }
}
