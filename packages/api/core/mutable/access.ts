import { deepMerge } from '../../../common/helpers'
import type { ApiFunction, ApiContext } from '../../types/function'
import type { CollectionDescription } from '../../../types'
import * as baseControl from '../access/baseControl'

export type Options = {
  queryPreset: {
    filters: Record<string, any>
    sort: Record<string, any>
  }
}

export const useAccessControl = (description: CollectionDescription, _options: Options, context: ApiContext) => {
  const options = _options||{}
  const apiConfig = context?.apiConfig||{}

  if( description.options ) {
    Object.assign(options, description.options)
  }

  const beforeRead: ApiFunction<any> = (props, token) => {
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

  const beforeWrite: ApiFunction<any> = (props, token) => {
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
