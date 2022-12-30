import * as Hapi from '@hapi/hapi'

import '../../common/polyfill'
import  type { ApiContext } from '../types'
import { connectDatabase } from '../core/database'
import getRoutes from './routes'
export { getToken } from './handler'

const defaultConfig = {
  port: 3000,
  modules: [],
  descriptions: {},
  roles: {
    guest: {
      grantEverything: true
    }
  }
}

export const init = async (_context?: Partial<ApiContext>|null): Promise<Hapi.Server> => {
  const apiConfig = Object.assign({}, defaultConfig)
  Object.assign(apiConfig, _context?.apiConfig||{})

  const context: Partial<ApiContext> = Object.assign({}, _context||{})
  Object.assign(context, { apiConfig })

  if( apiConfig.modules ) {
    global.modules = apiConfig.modules
  }

  if( context?.descriptions ) {
    global.descriptions = context.descriptions
  }

  const server = Hapi.server({
    port: apiConfig.port,
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

  const routes = getRoutes(context)
  for( const route of routes ) {
    server.route(route)
  }

  return server
}

export const initWithDatabase = async (...args: Parameters<typeof init>) => {
  await connectDatabase()
  return init(...args)
}

export const initThenStart = async (...args: Parameters<typeof init>) => {
  const server = await init(...args)
  server.start()
}

export const initWithDatabaseThenStart = async (...args: Parameters<typeof init>) => {
  const server = await initWithDatabase(...args)
  server.start()
}
