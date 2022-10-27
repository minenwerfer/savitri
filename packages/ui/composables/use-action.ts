import { reactive } from 'vue'
import type { Router } from 'vue-router'
import type { CollectionAction, StoreEffect } from '../../common/types'
import type { ActionEvent } from '../../web/types/action'
import { STORE_EFFECTS } from '../../common/constants'

const getEffect = (store: any, effectName: StoreEffect) => {
  const effect = STORE_EFFECTS[effectName]
  return store[effect]
}

export default <T extends { $id: string }, F extends { _id: string }>(
  store: (T & Record<string, (...args: any[]) => any>),
  router: Router
) => {
  const eventBus = reactive<ActionEvent>({
    id: -1,
    name: '',
    params: {}
  })

  const fn = (actionProps: CollectionAction & { action: string }) => {
    const { action: actionName, effect: actionEffect } = actionProps
    const [scopeName, scopedAction] = actionName.split('/')

    if( scopedAction ) {
      if( scopeName === 'route' ) {
        return async (filters: F) => {
          if( actionProps.clearItem ) {
            store.clearItem()
          }

          if( actionProps.fetchItem && filters?._id ) {
            await store.get({
              filters: {
                _id: filters._id 
              }
            })
          }

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
            id: Math.random(),
            name: scopedAction,
            params: { filters }
          })
        }
      }
    }

    const storeAction = (() => {
      if( actionName in store ) {
        return store[actionName]
      }

      return actionEffect
        ? (payload: any) => store.customEffect(actionName, payload, getEffect(store, actionEffect))
        : (payload: any) => store.custom(actionName, payload)
    })()

    if( actionProps.ask ) {
      return (filters: F) => store.ask({
        action: storeAction,
        params: { filters }
      })
    }

    return (filters: F) => storeAction({ filters })
  }

  return [
    fn,
    eventBus
  ]
}
