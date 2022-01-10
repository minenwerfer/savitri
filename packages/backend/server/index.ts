import { Request, ResponseToolkit, Server } from '@hapi/hapi'
import * as Hapi from '@hapi/hapi'
import { commonControllers } from '../src/controllers'
import { TokenService } from '../src/services/tokenService'
import { HandlerRequest } from '../src/controllers/abstract/Controller'
import '../../common/src/polyfill'

import { FileController } from '../src/controllers/FileController'

interface Environment {
  PAGINATION_LIMIT?: number;
}

async function handler(request: Request & HandlerRequest, h: ResponseToolkit) {
  try {

    const { params: { controller, verb } } = request

    if( /^_/.test(verb) ) {
      throw 'cannot call private method'
    }

    const controllerPath = commonControllers.includes(controller)
      ? '../src/controllers'
      : `${process.cwd()}/api-assets/controllers`

    const controllerName = `${controller.replace(/\./g, '').capitalize()}Controller`
    const Controller = require(`${controllerPath}/${controllerName}`)[controllerName]
    const instance = new Controller;

    if( !(verb in instance) ) {
      throw 'invalid verb'
    }

    const token = request.headers.authorization
      ? await TokenService.decode(request.headers.authorization.split('Bearer ').pop() || '')
      : {}

    // use webinterface whenever it's available
    const result = await (instance.webInterface || instance)[verb](request, h, token)
    if( /_?get/i.test(verb) && !result ) {
      throw 'item not found'
    }

    const mime = instance.rawType(verb)
    if( mime ) {
      return h.response(result)
        .header('Content-Type', mime)
    }

    return {
      result,
      ...(Array.isArray(result) ? {
        recordsCount: result.length,
        recordsTotal: await instance.count({ filter: request.payload?.filter || {}  }),
        offset: request.payload?.offset || 0,

        // 35 is a fallback
        limit: +((process.env as Environment).PAGINATION_LIMIT || 35),
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

export const init = async (port: number = 3000): Promise<Server> => {
  const server = Hapi.server({
    port,
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
    path: '/api/download/{hash}/{options?}',
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
