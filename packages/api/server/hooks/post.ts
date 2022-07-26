import type { Request } from '@hapi/hapi'
import type { Controller } from '../../core/controller'
import { HandlerRequest } from '../../core/controller'

export const appendPagination = async (
  result: object|Array<object>,
  instance: Controller<any> & { count?: (filter: any) => Promise<number> },
  request: Request & HandlerRequest
) => {
  const response = {
    result
  }

  if( Array.isArray(result) ) {
    const recordsTotal = typeof instance.count === 'function'
      ? await instance.count({ filters: request.payload?.filters || {} })
      : result.length

    const limit = request.payload?.limit
      ? +request.payload.limit
      : +(process.env.PAGINATION_LIMIT || 35)

    Object.assign(response, {
      recordsCount: result.length,
      recordsTotal,
      offset: request.payload?.offset || 0,
      limit
    })
  }

  return response
}

