import * as R from 'ramda'
import type { Model } from 'mongoose'
import type { CollectionDescription } from '../../../types'
import type { ApiContextWithAC, MongoDocument, DecodedToken } from '../../types'
import type { GetAllProps, CollectionFunctions } from './functions.types'
import { fromEntries } from '../../../common/helpers'
import { normalizeProjection, fill, prepareInsert } from '../collection'
import { makeException } from '../exceptions'

const DEFAULT_SORT = {
  date_updated: -1,
  date_created: -1,
  created_at: -1,
}

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
  
  const _insert = async (props: { what: Partial<T> }, token: DecodedToken|null) => {
    const { _id } = props.what
    const { what } = beforeWrite(props, token, context)
    const readyWhat = prepareInsert(what, description)

    if( !_id ) {
      const newDoc = await model.create(readyWhat)
      return model.findOne({ _id: newDoc._id }).lean({
        autopopulate: true
      })
    }

    return model.findOneAndUpdate(
      { _id }, readyWhat,
      { new: true, runValidators: true }
    ).lean({
      autopopulate: true
    })
  }

  const _getAll = (props: GetAllProps<T>, token: DecodedToken|null) => {
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
      .lean({
        autopopulate: true
      })
  }

  const functions: CollectionFunctions<T> = {
    async insert(props, token) {
      const result = await _insert(props, token)
      if( result ) {
        return fill(result, description)
      }
    },

    async get(props) {
      if( !props?.filters ) {
        throw new Error('no filter specified')
      }

      const pipe = R.pipe(
        (item) => {
          if( !item ) {
            throw makeException({
              name: 'ItemNotFound',
              message: 'item wasnt found'
            })
          }

          return item
        },
        (item) => fill(item, description),
      )

      const result = await model.findOne(props.filters, normalizeProjection<T>(props.project))
      return pipe(result as T)
    },

    async getAll(props, token) {
     const result = await _getAll(props||{}, token)
     return result.map((item) => {
       if( item ) {
         return fill(item, description)
       }
     })
    },

    async delete(props, token) {
      if( !props.filters ) {
        throw new Error('no criteria specified')
      }
      
      const query = beforeRead(props, token, context)
      return model.findOneAndDelete(query.filters, { strict: 'throw' })
    },

    async deleteAll(props, token) {
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

    async modify(props, token) {
      const { what, filters } = beforeWrite(props, token, context)
      const readyWhat = prepareInsert(what, description)

      return model.findOneAndUpdate(filters, readyWhat, { new: true, runValidators: true })
    },

    async modifyAll(props, token) {
      const { what, filters } = beforeWrite(props, token, context)
      const readyWhat = prepareInsert(what, description)

      return model.updateMany(filters.filters, readyWhat)
    },

    async count(props, token) {
      const query = beforeRead(props, token, context)
      const count = await model.countDocuments(query.filters) as unknown
      return count as number
    },
  }
  
  return functions
}
