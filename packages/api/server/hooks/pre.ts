import type { ResponseToolkit } from '@hapi/hapi'
import type { HandlerRequest } from '../../core/controller'
import type { DecodedToken } from '../../types'
import { PAGINATION_PER_PAGE_LIMIT } from '../../../common/constants'

export const prependPagination = (
  request: HandlerRequest,
) => {
  if(
    typeof request.payload?.limit === 'number'
    && request.payload.limit > PAGINATION_PER_PAGE_LIMIT
  ) {
    request.payload.limit = PAGINATION_PER_PAGE_LIMIT
  }
}

export const prependGuards = (
  request: HandlerRequest,
  response: ResponseToolkit,
  decodedToken: DecodedToken
) => {
  //
}
