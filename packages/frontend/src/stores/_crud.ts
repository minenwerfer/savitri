import { proxiedHttp as http } from './_http'
import { CollectionState } from '../../../common/types'

type FilteredFunction = 
  <T>(this: CollectionState<T>, filters: Partial<T>) => T

type FilteredByIdFunction =
  <T extends { _id: string }>(this: CollectionState<T>, filters: Pick<T, '_id'>) => T


export const actions = {
  getMany() {
    //
  },

  insert<T>(this: CollectionState<T>, what: T) {
    //
  },

  delete<T>(this: CollectionState<T>, filters: Partial<T>) {
    //
  },

  deleteMany() {
    //
  },

  modify() {
    //
  },

  modifyMany() {
    //
  }
}
