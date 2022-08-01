import { reactive } from 'vue'
import type { Router } from 'vue-router'
import type { CollectionAction } from '../../../common/types'
import type { ActionEvent } from '../../types/action'

export const useAction = <T extends { $id: string }, F extends { _id: string }>(
  store: (T & Record<string, (...args: any[]) => any>),
  router: Router
) => {
  const eventBus = reactive<ActionEvent>({
    id: -1,
    name: '',
    params: {}
  })

  const fn = (actionProps: CollectionAction & { action: string }) => {
    const { action: actionName } = actionProps
    const [scopeName, scopedAction] = actionName.split('/')

    if( scopedAction ) {
      if( scopeName === 'route' ) {
        return async (filters: F) => {
          await store.get({
            filters: {
              _id: filters._id 
            }
          })

          router.push({
            name: actionName.split('/')[1],
            params: {
              id: filters._id
            }
          })
        }
      }

      if( scopeName === 'ui' ) {
        return (filters: F) => {
          Object.assign(eventBus, {
            id: (new Date()).getTime(),
            name: scopedAction,
            params: { filters }
          })
        }
      }
    }

    if( !(actionName in store) ) {
      throw new Error(
        `actionName "${actionName} doesnt exist on store ${store.$id}"`
      )
    }

    if( actionProps.ask ) {
      return (filters: F) => store.ask({
        action: store[actionName],
        params: { filters }
      })
    }

    return store[actionName]
  }

  return [
    fn,
    eventBus
  ]
}
