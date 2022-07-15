import { Request, ResponseToolkit } from '@hapi/hapi'
import { HandlerRequest } from '../core/controller'

import { getController } from '../core/controller'
import { TokenService } from '../core/services/token.service'
import { FileController } from '../collections/file/file.controller'

export type RegularVerb =
  'get'
  | 'getAll'
  | 'insert'
  | 'modify'
  | 'delete'
  | 'deleteAll'

export const getToken = (request: Request) => request.headers.authorization
  ? TokenService.decode(request.headers.authorization.split('Bearer ').pop() || '')
  : {} as object

export const safeHandle = (fn: (request: Request & HandlerRequest, h: ResponseToolkit) => void) => async (request: Request & HandlerRequest, h: ResponseToolkit) => {
  try {
    fn(request, h)
  } catch(error: any) {
    if( process.env.NODE_ENV !== 'production' ) {
      console.trace(error)
    }

    return {
      message: error.message,
      _error: error
   }
  }
}

export const customVerbs = async (
  request: Request & HandlerRequest,
  h: ResponseToolkit
) => {
    const {
      params: {
        controller,
        verb
      }
    } = request

    // if( /^_/.test(verb) ) {
    //   throw new Error('cannot call private method')
    // }

    const Controller = getController(controller)
    const _instance = new Controller
    const instance = _instance.webInterface || _instance

    // if( !(verb in instance) ) {
    //   throw new Error('invalid verb')
    // }

    const token = getToken(request)
    const result = await instance[verb](request, h, token)

    // use webinterface whenever it's available
    // const result = await (instance.webInterface || instance)[verb](request, h, token)
    // if( /_?get$/i.test(verb) && Object.keys(result).length === 0 ) {
    //   throw new Error('item not found')
    // }

    const mime = instance.rawType(verb)
    if( mime ) {
      return h.response(result)
        .header('Content-Type', mime)
    }

    // const limit = request.payload.limit
    //   ? +request.payload.limit
    //   : +((process.env as Environment).PAGINATION_LIMIT || 35)

    // return {
    //   result,
    //   ...(Array.isArray(result) ? {
    //     recordsCount: result.length,
    //     recordsTotal: typeof instance.count === 'function' ? await instance.count({ filters: request.payload?.filters || {}  }) : result.length,
    //     offset: request.payload?.offset || 0,

    //     // 35 is a fallback
    //     limit,
    //   } : {})
    //   }
    return {
      result
    }
}

export const fileDownload = async (request: Request & HandlerRequest, h: ResponseToolkit) => {
  const instance = new FileController

  const { hash, options } = request.params
  const { filename, content, mime } = await instance.download(hash)

  const parsedOptions = (options||'').split(',')
  const has = (opt: string) => parsedOptions.includes(opt)

  return h.response(content)
    .header('Content-Type', mime)
    .header('Content-Disposition', `${has('download') ? 'attachment; ' : ''}filename=${filename}`)
}

export const regularVerb = (verb: RegularVerb) => async (request: Request & HandlerRequest, h: ResponseToolkit) => {
  const {
    controller,
    id
  } = request.params||{}

  const Controller = getController(controller)
  const instance = (new Controller).webInterface

  const token = getToken(request)
  const requestCopy = Object.assign({ payload: {} }, request)

  if( id ) {
    requestCopy.payload.filters = {
      ...requestCopy.payload.filters,
      _id: id
    }
  }

  const result = await instance[verb](requestCopy, h, token)

  return {
    result
  }
}
