import { defineStore } from 'pinia'
import type { User } from '@semantic-api/system/resources/collections/user/user.description'
import { useCollection } from '../state/collection'
import useMetaStore from './meta'

type Credentials = {
  email: string
  password: string
}

type UserState = {
  token: string
  credentials: Credentials|object
  currentUser: Partial<User>
}

const collection = useCollection({
  state: (): UserState => ({
    token: '',
    currentUser: {},
    credentials: {
      email: '',
      password: ''
    }
  }),
  actions: {
    authenticate(payload: Credentials) {
      try {
        return this.customEffect(
          'authenticate', payload,
          async ({ user, extra, token: _token }: {
            user: User
            extra: Record<string, any>
            token: { 
              type: 'Bearer'
              token: string
            }
          }) => {
            this.credentials = {}
            this.currentUser = {
              ...user,
              extra
            }

            const {
              type: _tokenType,
              token
            } = _token

            userStorage.setItem('auth:token', token)
            userStorage.setItem('auth:currentUser', JSON.stringify(this.currentUser))

            const metaStore = useMetaStore()
            await metaStore.describeAll()
          }
        )
      } catch( err ) {
        this.signout()
        throw err
      }
    },

    signout() {
      userStorage.clear()
      this.currentUser = {}
    }
  },
  getters: {
    properties() {
      const metaStore = useMetaStore()
      const properties = this.description.properties!
      properties.roles.items.enum = Object.keys(metaStore.roles)

      return properties
    },
    $currentUser(): User {
      if( !this.currentUser?._id ) {
        this.token = userStorage.getItem('auth:token')
        this.currentUser = JSON.parse(userStorage.getItem('auth:currentUser')||'{}')
      }

      return this.currentUser
    },
    signedIn() {
      return !!this.$currentUser.roles
    }
  }
})

export default defineStore('user', collection)
