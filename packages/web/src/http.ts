import { request } from '@semantic-api/common'
import { SV_API_URL } from '@semantic-api/types'
import { useStore } from './state/use'

const API_URL = import.meta.env.VITE_SAVITRI_API_URL || SV_API_URL

export const useHttp = () => {
  return {
    http: call(proxiedHttp),
    unproxiedHttp: call(request),
    apiUrl: API_URL
  }
}

const call = (target: typeof proxiedHttp | typeof request) => <Return=any>(...args: Parameters<typeof request<any>>) => {
  args[0] = `${API_URL}/${args[0]}`
  return (target<Return>).apply({}, args)
}

const proxiedHttp = async <Return>(...args: Parameters<typeof request<any>>) => {
  return request<Return>(...args).catch((error: any) => {
    const userStore = useStore('user')
    if( error.logout || ['JsonWebTokenError', 'TokenExpiredError'].includes(error.name) ) {
      userStore.signout()
      ROUTER.push({ name: '/user/signin' })
    }

    console.trace(error)
    throw error
  })
}
