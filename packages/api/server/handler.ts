if( process.env.MODE !== 'PRODUCTION') {
  require('dotenv').config()
}

import * as R from 'ramda'
import { getEntityFunction } from '../core/assets'
import type { Request, ResponseToolkit } from '@hapi/hapi'
import type {
  HandlerRequest,
  DecodedToken,
  ApiContext

} from '../types'

import { Error as MongooseError } from 'mongoose'

import { getController } from '../core/controller'
import { TokenService } from '../core/token'
// import { FileController } from '../../system/collections/file/file.controller'

import { sanitizeRequest, prependPagination } from './hooks/pre'
import { appendPagination } from './hooks/post'

export type RegularVerb =
  'get'
  | 'getAll'
  | 'insert'
  | 'modify'
  | 'delete'
  | 'deleteAll'

const prePipe = R.pipe(
  sanitizeRequest,
  prependPagination
)

const postPipe = R.pipe(
  appendPagination
)

const fallbackContext = {
  apiConfig: {},
  injected: {}
}

export const getToken = async (request: Request) => request.headers.authorization
  ? TokenService.decode(request.headers.authorization.split('Bearer ').pop() || '')
  : {} as object

export const safeHandle = (
  fn: (request: HandlerRequest, h: ResponseToolkit) => any|Promise<any>
) => async (request: HandlerRequest, h: ResponseToolkit) => {
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

    const response: { error: any, validation?: any } = {
      error: {
        name: error.name,
        code: error.code,
        message: error.message
      }
    }

    if( error instanceof MongooseError.ValidationError ) {
      const errors = Object.values(error.errors)
      response.error.silent = true
      response.error.validation = errors.reduce((a: any, error: any) => {
        return {
          ...a,
          [error.path]: {
            type: error.kind,
            detail: null
          },
        }
      }, {})
    }

    return response
  }
}

export const safeHandleContext = (
  fn: (request: HandlerRequest, h: ResponseToolkit, context: ApiContext) => object,
  _context?: Partial<ApiContext>
) => {
  const fc = Object.assign({}, fallbackContext)
  const context = Object.assign(fc, _context)

  const fn2 = (r: HandlerRequest, h: ResponseToolkit) => fn(r, h, context)
  return safeHandle(fn2)
}

export const customVerbs = (type: 'collections'|'controllables') =>
  async (
  request: HandlerRequest,
  h: ResponseToolkit,
  _context?: ApiContext
) => {
    // const {
    //   params: {
    //     controller,
    //     verb
    //   }
    // } = request
    // const context = {
    //   apiConfig: {},
    // }

    // const token = await getToken(request) as DecodedToken
    // const instance = useCollection('user', context)

    // const result = await instance.getAll({
    //   a: 1
    // }, token)
    //
    // const result = getEntityAsset<'function'>('user@get', 'function')(null, null, {
    //   apiConfig: {}
    // })

    const context = _context||fallbackContext
    const result = getEntityFunction('meta@test', 'controllable')(null, null, context)

    // const Controller = getController(controller, type)
    // const instance = new Controller
    
    // instance.injected = context||{}

    // const token = await getToken(request) as DecodedToken
    // const method = (instance.webInterface||instance)[verb]

    // prePipe({ request, token, response: h })
    // const result = await method(request, token, h)


    return result
    // return postPipe({result, instance, request})
}

export const regularVerb = (verb: RegularVerb) =>
  async (
    request: HandlerRequest,
    h: ResponseToolkit,
    context?: ApiContext
) => {
  const {
    controller,
    id
  } = request.params||{}

  const Controller = getController(controller)
  const _instance = new Controller
  const instance = _instance.webInterface
  instance.injected = context

  const token = await getToken(request) as DecodedToken

  prePipe({ request, token, response: h })
  const requestCopy = Object.assign({}, request)
  requestCopy.payload ||= {}

  if( id ) {
    requestCopy.payload.filters = {
      ...requestCopy.payload.filters||{},
      _id: id
    }

    if( 'what' in requestCopy.payload ) {
      requestCopy.payload.what._id = id
    }
  }

  const result = await instance[verb](requestCopy, token, h)
  return postPipe({result, instance, request})
}

export const fileDownload = async (request: HandlerRequest, h: ResponseToolkit) => {
  // const instance = new FileController

  // const { hash, options } = request.params
  // const { filename, content, mime } = await instance.download(hash)

  // const parsedOptions = (options||'').split(',')
  // const has = (opt: string) => parsedOptions.includes(opt)

  // return h.response(content)
  //   .header('Content-Type', mime)
  //   .header('Content-Disposition', `${has('download') ? 'attachment; ' : ''}filename=${filename}`)
}

export const fileInsert = async (
  request: HandlerRequest,
  _h: ResponseToolkit,
  context?: ApiContext
) => {
  // const instance = new FileController
  // const token = await getToken(request) as DecodedToken
  // instance.injected = context!

  // const result = await instance.insert(request.payload as any, token)
  // return { result }
}
