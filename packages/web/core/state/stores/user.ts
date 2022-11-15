import { defineStore } from 'pinia'
import type { User } from '../../../../system/collections/user/user.description'
import useCollection from '../collection'
import { normalizeProperties, normalizeValues } from '../helpers'
import useMetaStore from './meta'

type Credentials = {
  email: string
  password: string
}

type UserState = {
  credentials: Credentials|object
  currentUser: Partial<User>
}

const collection = useCollection({
  state: (): UserState => ({
    currentUser: {},
    credentials: {
      email: '',
      password: ''
    }
  }),
  actions: {
    authenticate(payload: Credentials) {
      try {
        return this.$customEffect(
          'authenticate', payload,
          async ({ user, token }: {
            user: User
            token: string
          }) => {
            this.credentials = {}
            this.currentUser = { ...user }

            sessionStorage.setItem('auth:token', token)
            sessionStorage.setItem('auth:currentUser', JSON.stringify(user))

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
      sessionStorage.clear()
      this.currentUser = {}
    }
  },
  getters: {
    properties() {
      const metaStore = useMetaStore()
      const properties = normalizeProperties(this.description.properties!)
      properties.role.values = normalizeValues(Object.keys(metaStore.roles))

      return properties
    },

    $currentUser(): UserState['currentUser'] {
      if( !this.currentUser?._id ) {
        this.currentUser = JSON.parse(sessionStorage.getItem('auth:currentUser')||'{}')
      }

      return this.currentUser
    }
  }
})

export default defineStore('user', collection)
