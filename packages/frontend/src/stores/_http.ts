import { RequestProvider } from '../../../common'

export const SV_API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api'
  : '/api'

export const SV_API_URL_2 = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001/api'
  : '/api2'

export const http = new RequestProvider({
  baseURL: SV_API_URL
})

/**
 * @function
 * Catchs errors then spawns a modal.
 */
export const httpMethodWrapper = (
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
    .catch(async (error: string) => {
      if( error === 'signed out' ) {
        // ctx.dispatch('user/signout', {}, { root: true })

//         await ctx.dispatch('meta/spawnModal', {
//           title: 'Sua sessão expirou',
//           body: 'Você será redirecionado para a página de login.',

//         }, { root: true });

        window._router.push({ name: 'signin' })

      } else {
        // ctx.commit('meta/MODAL_SPAWN', {
        //   title: 'Erro',
        //   body: error

        // }, { root: true })

      }

      console.trace(error)
      reject(error)
    })
})

export const proxiedHttp = new Proxy(http, {
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
