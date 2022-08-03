import type { ResponseToolkit } from '@hapi/hapi'
import type { HandlerRequest, DecodedToken } from '../../types'
import { PAGINATION_PER_PAGE_LIMIT } from '../../../common/constants'

export const prependPagination = (
  request: HandlerRequest,
  _response: ResponseToolkit,
  _decodedToken: DecodedToken
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
