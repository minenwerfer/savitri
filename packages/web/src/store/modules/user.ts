import { Module, CommonState, ActionProps, SV_API_URL_2 } from '../module'
import { AxiosResponse } from 'axios'

/**
 * @exports @interface
 * User metadata.
 */
export interface User {
  current: {
    token: string,
    level: Array<string>
  }
}

/**
 * @exports @interface
 * User item.
 */
export interface UserItem {
  name?: string,
  email: string,
  active?: boolean,
  level?: number,
}

/**
 * @exports @const
 * Initial state.
 */
export const initialState = {
  current: {
    email: '',
    token: '',
    level: [],
  }
}

/**
 * @exports @const
 * Initial item state.
 */
export const initialItemState = {
  email: '',
  verification: '',
}

/**
 * @exports @class
 * User module.
 */
export class UserModule extends Module<User, UserItem> {
  constructor() {
    super('user', initialState, initialItemState)
  }

  actions(this: UserModule) {
    return {
      authenticate: ({ commit, dispatch, state: { current } }: ActionProps & { state: CommonState & { current: any } }): Promise<void> => new Promise((resolve) => {
        const payload = {
          email: current.email,
          password: current.password,
        }

        dispatch('swapLoading', true)
        this.http.post({ commit, dispatch }, this.route('authenticate'), payload)
          .then(async ({ data: { result } }: AxiosResponse) => {
            commit('USER_AUTH', result)
            commit('ITEM_CLEAR')

            await dispatch('meta/describeAll', {}, { root: true })
            window.dispatchEvent(new CustomEvent('__storeCreated'))
            resolve()
          })
          .finally(() => dispatch('swapLoading', false))
      }),

      signout: ({ commit }: ActionProps): Promise<void> => new Promise((resolve) => {
        commit('USER_SIGNOUT')
        resolve()
      }),

      spawnChangePwd: ({ commit }: ActionProps, { payload: { filters } }: { payload: { filters: any } }) => {
        commit('ITEM_GET', { result: filters });
        (window as any)._router.push({ name: 'dashboard-user-changepass' })
      }
    }
  }

  getters() {
    return {
      token: (state: any) => state.current.token,
      current: () => JSON.parse(sessionStorage.getItem('auth:currentUser')||'{}'),
    }
  }

  mutations() {
    return {
      USER_AUTH(state: CommonState & { current: any }, value: { token: string }) {
        Object.assign(state.current, {
          ...value,
          password: ''
        })

        sessionStorage.setItem('auth:token', value.token)
        sessionStorage.setItem('auth:currentUser', JSON.stringify(value))
      },

      CURRENT_UPDATE(state: CommonState & { current: any }) {
        const value = JSON.parse(sessionStorage.getItem('auth:currentUser')||'{}')

        Object.assign(state.current, value)
        sessionStorage.setItem('auth:currentUser', JSON.stringify(value))
      },

      USER_SIGNOUT(state: CommonState & { current: any }) {
        state.current = {}
        sessionStorage.removeItem('auth:token')
      }
    }
  }
}
