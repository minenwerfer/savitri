import type { Request } from '@hapi/hapi'
// import type { Controller } from '../../core/controller'
import type { HandlerRequest } from '../../types'

type PostHookParams = {
  result: object|Array<object>,
  request: Request & HandlerRequest
  instance: any // change this
}

export const appendPagination = async (params: PostHookParams) => {
  const {
    result,
    request
  } = params

  const response = {
    result
  }

  if( Array.isArray(result) ) {
    const recordsTotal = 0
    // const recordsTotal = typeof instance.count === 'function'
    //   ? await instance.count({ filters: request.payload?.filters || {} })
    //   : result.length

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

