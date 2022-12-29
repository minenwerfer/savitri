import { deepMerge } from '../../../common/helpers'
import type { ApiFunction, ApiContext } from '../../types'
import type { CollectionDescription } from '../../../types'
import * as baseControl from './base-control'

type ReadPayload = {
  filters: Record<string, any>
  sort: Record<string, any>
  limit: number
}

type WritePayload = {
  what: Record<string, any>
  filters: Record<string, any>
}

export const useAccessControl = (description: CollectionDescription, context?: ApiContext) => {
  const options = description.options
    ? Object.assign({}, description.options)
    : {}

  const apiConfig = context?.apiConfig||{}

  const beforeRead: ApiFunction<any, ReadPayload> = (props, { token }) => {
    const newPayload = Object.assign({}, {
      filters: props?.filters||{},
      sort: props?.sort,
      limit: props?.limit
    })

    if( options.queryPreset ) {
      deepMerge(
        newPayload,
        options.queryPreset
      )
    }

    if( apiConfig.beforeRead && token ) {
      deepMerge(
        newPayload,
        apiConfig.beforeRead(token, description.$id)
      )
    }

    deepMerge(
      newPayload,
      baseControl.beforeRead!(token!, description.$id)
    )

    if( newPayload.limit > 150 ) {
      newPayload.limit = 150
    }

    return newPayload
  }

  const beforeWrite: ApiFunction<any, WritePayload> = (props, { token }) => {
    const newPayload = Object.assign({ what: {} }, props)
    const filters = newPayload.what || {}

    if( apiConfig.beforeWrite && token ) {
      deepMerge(
        filters,
        apiConfig.beforeWrite(token, description.$id)
      )
    }

    deepMerge(
      filters,
      baseControl.beforeWrite!(token!, description.$id)
    )

    return newPayload
  }

  return {
    beforeRead,
    beforeWrite
  }
}
