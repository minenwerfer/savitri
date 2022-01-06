import { Module, CommonState, ActionProps, PZ_API_URL_2 } from 'frontend/store/module'
import { AxiosResponse } from 'axios'

/**
 * @exports @interface
 * User metadata.
 */
export interface User {
  current: {
    token: string,
    level: string[]
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
  password: string,
}

/**
 * @exports @const
 * Initial state.
 */
export const initialState = {
  current: {
    email: '',
    password: '',
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
  password: ''
}

/**
 * @exports @class
 * User module.
 */
export class UserModule extends Module<User, UserItem> {

  constructor() {
    super('user', initialState, initialItemState, PZ_API_URL_2)
  }

  actions(this: UserModule) {
    return {
      authenticate: ({ commit, dispatch, state: { current } }: ActionProps & { state: CommonState & { current: any } }): Promise<void> => new Promise((resolve) => {
        const payload = {
          email: current.email,
          password: current.password,
        }

        dispatch('swapLoading', true)
        this.http.post(commit, this.route('authenticate'), payload)
          .then(async ({ data: { result } }: AxiosResponse) => {
            commit('USER_AUTH', result)
            commit('ITEM_CLEAR')

            await dispatch('meta/describeAll', {}, { root: true })
            window.dispatchEvent(new CustomEvent('__storeCreated'))
            resolve()
          })
          .finally(() => dispatch('swapLoading', false))
      })
    }
  }

  getters() {
    return {
      token: (state: any) => state.current.token,
    }
  }

  mutations() {
    return {
      USER_AUTH(state: CommonState & { current: any }, value: { token: string }) {
        Object.assign(state.current, { email: '', password: '' })
        Object.assign(state.current, value)
        sessionStorage.setItem('auth:token', value.token)
      }
    }
  }
}
