import { RequestProvider } from '../../common'
import { SV_API_URL } from '../../common/constants'
import { useStore } from './store'

export default () => {
  return {
    http: proxiedHttp
  }
}

const http = new RequestProvider({
  baseURL: SV_API_URL
})

/**
 * @function
 * Catchs errors then spawns a modal.
 */
const httpMethodWrapper = (
  target: RequestProvider,
  method: any,
  ...args: any
) => new Promise((resolve, reject) => {
  const call = method.apply(target, ...args)
  if( !(call instanceof Promise) ) {
    return call
  }

  return call
    .then(resolve)
    .catch(async (error: Error) => {
      const metaStore = useStore('meta')

      if( ['TokenExpiredError', 'AuthorizationError'].includes(error.name) ) {
        // ctx.dispatch('user/signout', {}, { root: true })

//         await ctx.dispatch('meta/spawnModal', {
//           title: 'Sua sessão expirou',
//           body: 'Você será redirecionado para a página de login.',

//         }, { root: true });


        sessionStorage.clear()
        ROUTER.push({ name: 'signin' })

      } else {
        // ctx.commit('meta/MODAL_SPAWN', {
        //   title: 'Erro',
        //   body: error

        // }, { root: true })
        //alert('uncaught')
        metaStore.spawnModal({
          title: 'Erro',
          body: error
        })
      }

      console.trace(error)
      reject(error.message)
    })
})

const proxiedHttp = new Proxy(http, {
  get: (target: any, key: string) => {
    const method = target[key]
    const subscribedMethods = [
      'request',
      'get',
      'post'
    ]

    return subscribedMethods.includes(key)
      ? (...args: any) => httpMethodWrapper(target, method, [...args])
      : (typeof method === 'function' ? (...args: any) => method.apply(target, args) : method)
  }
})
