import { Request, ResponseToolkit } from '@hapi/hapi'
import { HandlerRequest } from '../core/controller'

import { getController } from '../core/controller'
import { TokenService } from '../core/services/token.service'
import { FileController } from '../../collections/file/file.controller'

import {
  pipeHooks,
  appendPagination

} from './hooks'

export type RegularVerb =
  'get'
  | 'getAll'
  | 'insert'
  | 'modify'
  | 'delete'
  | 'deleteAll'

export const getToken = async (request: Request) => request.headers.authorization
  ? TokenService.decode(request.headers.authorization.split('Bearer ').pop() || '')
  : {} as object

export const safeHandle = (
  fn: (request: Request & HandlerRequest, h: ResponseToolkit) => object
) => async (request: Request & HandlerRequest, h: ResponseToolkit) => {
  try {
    const response = await fn(request, h)
    if( !response ) {
      throw new Error('empty response')
    }

    return response

  } catch(error: any) {
    if( process.env.NODE_ENV !== 'production' ) {
      console.trace(error)
    }

    return {
      _error: true,
      name: error.name,
      code: error.code,
      message: error.message
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

    const Controller = getController(controller)
    const instance = new Controller

    // if( !(verb in instance) ) {
    //   throw new Error('invalid verb')
    // }

    const token = await getToken(request)
    const method = (instance.webInterface||instance)[verb]

    const result = await method(request, h, token)

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

    const pipe = pipeHooks(
      appendPagination
    )

    return pipe(result, instance, request)
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

export const regularVerb = (verb: RegularVerb) =>
  async (request: Request & HandlerRequest, h: ResponseToolkit) => {
  const {
    controller,
    id
  } = request.params||{}

  const Controller = getController(controller)
  const _instance = new Controller
  const instance = _instance.webInterface

  const token = await getToken(request)
  const requestCopy = Object.assign(request, { payload: {} })

  if( id ) {
    requestCopy.payload.filters = {
      ...requestCopy.payload.filters||{},
      _id: id
    }

    if( 'what' in requestCopy.payload ) {
      requestCopy.payload.what._id = id
    }
  }

  const result = await instance[verb](requestCopy, h, token)
  const pipe = pipeHooks(
    appendPagination
  )

  return pipe(result, _instance, request)
}
