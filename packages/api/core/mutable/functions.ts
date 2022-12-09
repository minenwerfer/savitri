import * as R from 'ramda'
import type { Model } from 'mongoose'
import type { CollectionDescription } from '../../../types'
import type { CollectionFunction, MongoDocument } from '../../types'

import { fromEntries } from '../../../common/helpers'
import { normalizeProjection, fill, prepareInsert } from '../collection'
import { ItemNotFound } from '../exceptions'
import { useAccessControl } from './access'

type QuerySort<T> = Record<keyof T, 1|-1>

type GetAllProps<T> = {
  filters?: Partial<T>
  offset?: number
  limit?: number
  sort?: QuerySort<T>
  project?: Array<keyof T>

}

export default <T extends MongoDocument>(
  model: Model<T>,
  description: CollectionDescription,
  access: ReturnType<typeof useAccessControl>
) => {
  const {
    beforeRead,
    beforeWrite
  } = access

  
  const _insert: CollectionFunction<{ what: Partial<T> }> = async (props, token, apiConfig): Promise<T|null> => {
    const { _id } = props.what
    const { what } = beforeWrite(props, token, apiConfig)
    const readyWhat = prepareInsert(what, description)

    if( !_id ) {
      const newDoc = await model.create(readyWhat)
      return model.findOne({ _id: newDoc._id })
    }

    return model.findOneAndUpdate(
      { _id }, readyWhat,
      { new: true, runValidators: true }
    )
  }

  const _getAll: CollectionFunction<GetAllProps<T>> = (props, token, apiConfig) => {
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
    const query = beforeRead({ filters }, token, apiConfig)

    const sort = query.sort
      ? query.sort
      : props.sort || defaultSort

    return model.find(query.filters, normalizeProjection(props.project))
      .sort(sort)
      .skip(props.offset || 0)
      .limit(props.limit)
  }

  const functions: Record<string, CollectionFunction<any>> = {
    async insert(props: { what: Partial<T> }, token, apiConfig) {
      const result = await _insert(props, token, apiConfig)
      return fill(result?._doc||result, description)
    },

    async get( props: { filters?: Partial<T>, project?: Array<keyof T> }) {
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
        (item) => item && fill(item, description),
      )

      const result = await model.findOne(props.filters, normalizeProjection<T>(props.project))
      return pipe(result as T)
    },

    async getAll(props: GetAllProps<T>, token, apiConfig) {
     const result: Array<T> = await _getAll(props, token, apiConfig)

     const pipe = R.pipe(
       (item: T & { _doc?: T }) => item._doc || item,
       (item: T) => !props.project
        ? fill(item, description)
        : item
     )

     return result.map(pipe)
    },

    delete(props: { filters: Partial<T> }, token, apiConfig) {
      if( !props.filters ) {
        throw new Error('no criteria specified')
      }
      
      const query = beforeRead(props, token, apiConfig)
      return model.findOneAndDelete(query.filters, { strict: 'throw' })
    },

    deleteAll(props: { filters: Partial<T> }, token, apiConfig) {
      if( !Array.isArray(props.filters?._id) || props.filters?._id?.length === 0 ) {
        throw new Error('no criteria specified')
      }

      const { _id, ...rest } = props.filters
      const filters = {
        _id: { $in: props.filters._id },
        ...rest
      }

      const query = beforeRead({ filters }, token, apiConfig)
      return model.deleteMany(query.filters, { strict: 'throw' })
    },

    modify(props: { filters: Partial<T>, what: Partial<T> }, token, apiConfig) {
      const { what, filters } = beforeWrite(props, token, apiConfig)
      const readyWhat = prepareInsert(what, description)

      return model.findOneAndUpdate(filters, readyWhat, { new: true, runValidators: true })
    },

    modifyAll(props: { filters: Array<Partial<T>>, what: Partial<T> }, token, apiConfig) {
      const { what, filters } = beforeWrite(props, token, apiConfig)
      const readyWhat = prepareInsert(what, description)

      return model.updateMany(filters.filters, readyWhat)
    },

    count(props: { filters?: Partial<T> }, token, apiConfig) {
      const query = beforeRead(props, token, apiConfig)
      return model.countDocuments(query.filters)
    },
  }

  return functions
}
