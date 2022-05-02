import { Request, ResponseToolkit, Server } from '@hapi/hapi'
import * as Hapi from '@hapi/hapi'

import '../../common/src/polyfill'
import { getController, HandlerRequest } from '../core/controller'
import { TokenService } from '../core/services/token.service'

import { FileController } from '../entities/file/file.controller'

interface Environment {
  PAGINATION_LIMIT?: number
}

declare global {
  var modules: any[]
}

async function handler(request: Request & HandlerRequest, h: ResponseToolkit) {
  try {
    const { params: { controller, verb } } = request

    if( /^_/.test(verb) ) {
      throw new Error('cannot call private method')
    }

    const Controller = getController(controller)
    const instance = new Controller

    if( !(verb in instance) ) {
      throw new Error('invalid verb')
    }

    const token = request.headers.authorization
      ? TokenService.decode(request.headers.authorization.split('Bearer ').pop() || '')
      : {}

    // use webinterface whenever it's available
    const result = await (instance.webInterface || instance)[verb](request, h, token)
    if( /_?get$/i.test(verb) && Object.keys(result).length === 0 ) {
      throw new Error('item not found')
    }

    const mime = instance.rawType(verb)
    if( mime ) {
      return h.response(result)
        .header('Content-Type', mime)
    }

    const limit = request.payload.limit
      ? +request.payload.limit
      : +((process.env as Environment).PAGINATION_LIMIT || 35)

    return {
      result,
      ...(Array.isArray(result) ? {
        recordsCount: result.length,
        recordsTotal: typeof instance.count === 'function' ? await instance.count({ filters: request.payload?.filters || {}  }) : result.length,
        offset: request.payload?.offset || 0,

        // 35 is a fallback
        limit,
      } : {})
    }

  } catch(error: any) {
    console.trace(error)

    const { message } = error
    return {
      message,
      _error: error
   }

  } finally {
    //
  }
}

export const init = async (props?: { port?: number, modules?: any[] }): Promise<Server> => {
  props = props || {
    port: 3000,
    modules: []
  }

  if( props.modules ) {
    globalThis.modules = props.modules
  }

  const server = Hapi.server({
    port: props.port || 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
        headers: [
          'Accept', 
          'Accept-Version',
          'Authorization', 
          'Content-Length', 
          'Content-MD5', 
          'Content-Type', 
          'Date', 
          'X-Api-Version'
        ]
      }
    }
  })

  server.route({
    method: ['GET', 'POST'],
    path: '/api/{controller}/{verb}',
    handler
  })

  server.route({
    method: ['GET'],
    path: '/api/file/{hash}/{options?}',
    handler: async (request, h) => {
      try {
        const instance = new FileController

        const { hash, options } = request.params
        const { filename, content, mime } = await instance.download(hash)

        const parsedOptions = (options||'').split(',')
        const has = (opt: string) => parsedOptions.includes(opt)

        return h.response(content)
          .header('Content-Type', mime)
          .header('Content-Disposition', `${has('download') ? 'attachment; ' : ''}filename=${filename}`)

      } catch( error: any ) {
        console.trace(error)

        const { message } = error
        return {
          message,
          _error: error
       }
      }
    }
  })

  return server
}
