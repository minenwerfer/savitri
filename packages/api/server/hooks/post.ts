import type { Request } from '@hapi/hapi'
import type { HandlerRequest, ApiContext } from '../../types'
import { useCollection } from '../../core/collection'

type PostHookParams = {
  result: object|Array<object>,
  request: Request & HandlerRequest
  context: ApiContext
  entityName: string
}

export const appendPagination = async (params: PostHookParams) => {
  const {
    request,
    result,
    context,
    entityName
  } = params

  const response = {
    result
  }

  if( Array.isArray(result) ) {
    const countFunction = useCollection(entityName, context).count
    const recordsTotal = typeof countFunction === 'function'
      ? await countFunction({ filters: request.payload?.filters || {} })
      : result.length

    const limit = request.payload?.limit
      ? +request.payload.limit
      : +(process.env.PAGINATION_LIMIT || 35)

    Object.assign(response, {
      pagination: {
        recordsCount: result.length,
        recordsTotal,
        offset: request.payload?.offset || 0,
        limit
      }
    })
  }

  return response
}

