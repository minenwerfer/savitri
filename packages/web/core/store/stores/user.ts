import { defineStore } from 'pinia'
import type { UserDocument } from '../../../../collections/user/user.model'
import type { AccessProfileDocument } from '../../../../collections/accessProfile/accessProfile.model'
import useCollection from '../collection'
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
          async ({ user, token, access }: {
            user: UserDocument
            access: AccessProfileDocument
            token: string
          }) => {
            this.credentials = {}
            this.currentUser = {
              ...user,
              access
            }

            sessionStorage.setItem('auth:token', token)
            sessionStorage.setItem('auth:currentUser', JSON.stringify({ ...user, access }))

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
    $currentUser(): UserState['currentUser'] {
      if( !this.currentUser?._id ) {
        const currentUser = JSON.parse(sessionStorage.getItem('auth:currentUser')||'{}')
        return currentUser
      }

      return !this.currentUser._id
        ? JSON.parse(sessionStorage.getItem('auth:currentUser')||'{}')
        : this.currentUser
    }
  }
})

export default defineStore('user', collection)
