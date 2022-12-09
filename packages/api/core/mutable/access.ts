import { deepMerge } from '../../../common/helpers'
import type { CollectionFunction } from '../../types/function'
import type { CollectionDescription } from '../../../types'
import * as baseControl from '../access/baseControl'

export type Options = {
  queryPreset: {
    filters: Record<string, any>
    sort: Record<string, any>
  }
}

export const useAccessControl = (description: CollectionDescription, options: Options) => {
  const beforeRead: CollectionFunction<any> = (props, token, apiConfig) => {
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

  const beforeWrite: CollectionFunction<any> = (props, token, apiConfig) => {
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
