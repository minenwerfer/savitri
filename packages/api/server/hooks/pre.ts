import type { ResponseToolkit } from '@hapi/hapi'
import type { HandlerRequest, DecodedToken } from '../../types'
import { PAGINATION_PER_PAGE_LIMIT } from '../../../common/constants'

export const prependPagination = (
  request: HandlerRequest,
  _decodedToken: DecodedToken,
  _response: ResponseToolkit
) => {
  if(
    typeof request.payload?.limit === 'number'
    && request.payload.limit > PAGINATION_PER_PAGE_LIMIT
  ) {
    request.payload.limit = PAGINATION_PER_PAGE_LIMIT
  }
}

export const prependGuards = (
  _request: HandlerRequest,
  _decodedToken: DecodedToken,
  _response: ResponseToolkit
) => {
  //
}
