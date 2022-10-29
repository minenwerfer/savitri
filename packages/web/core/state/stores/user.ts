import { defineStore } from 'pinia'
import type { UserDocument } from '../../../../system/collections/user/user.model'
import useCollection from '../collection'
import { normalizeFields, normalizeValues } from '../helpers'
import useMetaStore from './meta'

type Credentials = {
  email: string
  password: string
}

type UserState = {
  credentials: Credentials|object
  currentUser: Partial<UserDocument>
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
            user: UserDocument
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
    fields() {
      const metaStore = useMetaStore()
      const fields = normalizeFields(this.description.fields!)
      fields.role.values = normalizeValues(Object.keys(metaStore.roles))

      return fields
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
