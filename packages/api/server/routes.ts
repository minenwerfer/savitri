import { ServerRoute } from '@hapi/hapi'
import {
  safeHandle,
  safeHandleProvide,
  regularVerb,
  customVerbs,
  fileDownload,
  fileInsert

} from './handler'

import type { ProvidedParams } from '../types'

export default (provide: ProvidedParams): Array<ServerRoute> => {
  const defaultHandler = (...args: Parameters<typeof safeHandle>) => {
    return safeHandleProvide(args[0], provide)
  }

  return [
    {
      method: 'GET',
      path: '/api/{controller}/{id}',
      handler: defaultHandler(regularVerb('get'))
    },
    {
      method: 'GET',
      path: '/api/{controller}',
      handler: defaultHandler(regularVerb('getAll'))
    },
    {
      method: 'POST',
      path: '/api/{controller}',
      handler: defaultHandler(regularVerb('insert'))
    },
    {
      method: 'PUT',
      path: '/api/{controller}/{id}',
      handler: defaultHandler(regularVerb('modify'))
    },
    {
      method: 'DELETE',
      path: '/api/{controller}/{id}',
      handler: defaultHandler(regularVerb('delete'))
    },
    {
      method: 'POST',
      path: '/api/{controller}/{verb}',
      handler: defaultHandler(customVerbs('collections'))
    },
    {
      method: ['POST', 'GET'],
      path: '/api/_/{controller}/{verb}',
      handler: defaultHandler(customVerbs('controllables'))
    },
    {
      method: 'GET',
      path: '/api/file/{hash}/{options?}',
      handler: defaultHandler(fileDownload)
    },
    {
      method: 'POST',
      path: '/api/file',
      handler: defaultHandler(fileInsert),
      options: {
        payload: {
          maxBytes: 2*(100*(1024**2))
        }
      }
    }
  ]
}
