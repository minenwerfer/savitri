import { ServerRoute } from '@hapi/hapi'
import {
  safeHandle,
  regularVerb,
  customVerbs,
  fileDownload

} from './handler'

export const routes: Array<ServerRoute> = [
  {
    method: 'GET',
    path: '/api/{controller}/{id}',
    handler: safeHandle(regularVerb('get'))
  },
  {
    method: 'GET',
    path: '/api/{controller}',
    handler: safeHandle(regularVerb('getAll'))
  },
  {
    method: 'POST',
    path: '/api/{controller}/new',
    handler: safeHandle(regularVerb('insert'))
  },
  {
    method: 'PUT',
    path: '/api/{controller}/{id}',
    handler: safeHandle(regularVerb('modify'))
  },
  {
    method: 'DELETE',
    path: '/api/{controller}/{id}',
    handler: safeHandle(regularVerb('delete'))
  },
  {
    method: 'POST',
    path: '/api/{controller}/{verb}',
    handler: safeHandle(customVerbs('collections'))
  },
  {
    method: ['POST', 'GET'],
    path: '/api/_/{controller}/{verb}',
    handler: safeHandle(customVerbs('controllables'))
  },
  {
    method: 'GET',
    path: '/api/file/{hash}/{options?}',
    handler: safeHandle(fileDownload)
  }
]
