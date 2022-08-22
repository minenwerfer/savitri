import * as Hapi from '@hapi/hapi'

import '../../common/polyfill'
import  type { ProvidedParams } from '../types'
import getRoutes from './routes'

declare global {
  var modules: Array<any>
}

export const init = async (props?: {
  port?: number
  modules?: Array<any>
  provide?: ProvidedParams
}): Promise<Hapi.Server> => {
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

  const routes = getRoutes(props.provide||{})
  for( const route of routes ) {
    server.route(route)
  }

  return server
}
