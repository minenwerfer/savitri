import type { Request } from '@hapi/hapi'
import type { HandlerRequest, DecodedToken } from '../../types'
import { useCollection } from '../../core/mutable'

type PostHookParams = {
  result: object|Array<object>,
  request: Request & HandlerRequest
  token: DecodedToken|null
  entityName: string
}

export const appendPagination = async (params: PostHookParams) => {
  const {
    request,
    result,
    token,
    entityName
  } = params

  const response = {
    result
  }

  if( Array.isArray(result) ) {
    const countFunction = useCollection(entityName).count
    const recordsTotal = typeof countFunction === 'function'
      ? await countFunction({ filters: request.payload?.filters || {} }, token)
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

