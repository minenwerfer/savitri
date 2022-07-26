import { defineStore } from 'pinia'
import type { CollectionState, CollectionStoreActions } from '../../types/store'
import type { User } from '../../../collections/user/user.model'
import useCollection from './_collection'
import useMetaStore from './meta'

const {
  state: collectionState,
  actions: collectionActions,
  getters
} = useCollection()

type Credentials = {
  email: string
  password: string
}

type UserState = CollectionState<User> & {
  credentials: Credentials|object
  currentUser: User|object
}

export default defineStore('user', {
  state: (): UserState => ({
    ...collectionState<User>(),
    currentUser: {},
    credentials: {
      email: '',
      password: ''
    }
  }),
  actions: {
    ...collectionActions,
    authenticate(this: UserState & CollectionStoreActions, payload: Credentials) {
      return this.customEffect(
        'authenticate', payload,
        async (result: User & { token: string }) => {
          this.credentials = {}
          this.currentUser = {
            ...result
          }

          sessionStorage.setItem('auth:token', result.token)
          sessionStorage.setItem('auth:currentUser', JSON.stringify(result))

          const metaStore = useMetaStore()
          await metaStore.describeAll()

          // window.dispatchEvent(new CustomEvent('__storeCreated'))
        }
      )
    }
  },
  getters
})
