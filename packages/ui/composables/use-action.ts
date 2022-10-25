import { reactive } from 'vue'
import type { Router } from 'vue-router'
import type { CollectionAction } from '../../common/types'
import type { ActionEvent } from '../../web/types/action'
import { STORE_EFFECTS } from '../../common/constants'

const getEffect = (store: any, effectName: keyof typeof STORE_EFFECTS) => {
  if( !(effectName in STORE_EFFECTS) ) {
    throw new Error(
      `${effectName} isnt present in store`
    )
  }

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
        ? (filters: F) => store.customEffect(actionName, { filters }, getEffect(store, actionEffect))
        : (filters: F) => store.custom(actionName, { filters })
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
