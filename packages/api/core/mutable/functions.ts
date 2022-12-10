import * as R from 'ramda'
import type { Model } from 'mongoose'
import type { CollectionDescription } from '../../../types'
import type { ApiFunction, ApiContextWithAC, MongoDocument, } from '../../types'
import { fromEntries } from '../../../common/helpers'
import { normalizeProjection, fill, prepareInsert } from '../collection'
import { makeException } from '../exceptions'

const DEFAULT_SORT = {
  date_updated: -1,
  date_created: -1,
  created_at: -1,
}

type QuerySort<T> = Record<keyof T, 1|-1>

type GetAllProps<T> = {
  filters?: Partial<T>
  offset?: number
  limit?: number
  sort?: QuerySort<T>
  project?: Array<keyof T>
}

type OmitLastParameter<T=Parameters<ApiFunction<any>>> = T extends [ ...infer Head, any ]
  ? (...args: Head) => ReturnType<ApiFunction<any>>
  : never

export default <T extends MongoDocument>(
  model: Model<T>,
  description: CollectionDescription,
  _context: ApiContextWithAC|null
) => {
  const context = _context||{} as ApiContextWithAC
  const {
    access: {
      beforeRead,
      beforeWrite
    }
  } = context
  
  const _insert: ApiFunction<{ what: Partial<T> }> = async (props, token): Promise<T|null> => {
    const { _id } = props.what
    const { what } = beforeWrite(props, token, context)
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

  const _getAll: ApiFunction<GetAllProps<T>> = (props, token) => {
    if( typeof props.limit !== 'number' ) {
      props.limit = +(process.env.PAGINATION_LIMIT||35)
    }

    const entries = Object.entries(props.filters||{})
      .map(([key, value]) => [
        key,
        value && typeof value === 'object' && 'id' in value ? value._id : value
      ])

    const filters = fromEntries(entries) || {}
    const query = beforeRead({ filters }, token, context)

    const sort = query.sort
      ? query.sort
      : props.sort || DEFAULT_SORT

    return model.find(query.filters, normalizeProjection(props.project))
      .sort(sort)
      .skip(props.offset || 0)
      .limit(props.limit)
  }

  const functions: Record<string, OmitLastParameter> = {
    async insert(props: { what: Partial<T> }, token) {
      const result = await _insert(props, token, context)
      return fill(result?._doc||result, description)
    },

    async get( props: { filters?: Partial<T>, project?: Array<keyof T> }) {
      if( !props?.filters ) {
        throw new Error('no filter specified')
      }

      const pipe = R.pipe(
        (item: T & { _doc?: T }) => {
          if( !item ) {
            throw makeException({
              name: 'ItemNotFound',
              message: 'item wasnt found'
            })
          }

          return item._doc||item
        },
        (item) => item && fill(item, description),
      )

      const result = await model.findOne(props.filters, normalizeProjection<T>(props.project))
      return pipe(result as T)
    },

    async getAll(props: GetAllProps<T>, token) {
     const result: Array<T> = await _getAll(props||{}, token, context)

     const pipe = R.pipe(
       (item: T & { _doc?: T }) => item._doc || item,
       (item: T) => !props.project
        ? fill(item, description)
        : item
     )

     return result.map(pipe)
    },

    delete(props: { filters: Partial<T> }, token) {
      if( !props.filters ) {
        throw new Error('no criteria specified')
      }
      
      const query = beforeRead(props, token, context)
      return model.findOneAndDelete(query.filters, { strict: 'throw' })
    },

    deleteAll(props: { filters: Partial<T> }, token) {
      if( !Array.isArray(props.filters?._id) || props.filters?._id?.length === 0 ) {
        throw new Error('no criteria specified')
      }

      const { _id, ...rest } = props.filters
      const filters = {
        _id: { $in: props.filters._id },
        ...rest
      }

      const query = beforeRead({ filters }, token, context)
      return model.deleteMany(query.filters, { strict: 'throw' })
    },

    modify(props: { filters: Partial<T>, what: Partial<T> }, token) {
      const { what, filters } = beforeWrite(props, token, context)
      const readyWhat = prepareInsert(what, description)

      return model.findOneAndUpdate(filters, readyWhat, { new: true, runValidators: true })
    },

    modifyAll(props: { filters: Array<Partial<T>>, what: Partial<T> }, token) {
      const { what, filters } = beforeWrite(props, token, context)
      const readyWhat = prepareInsert(what, description)

      return model.updateMany(filters.filters, readyWhat)
    },

    count(props: { filters?: Partial<T> }, token) {
      const query = beforeRead(props, token, context)
      return model.countDocuments(query.filters)
    },
  }
  
  return functions
}
