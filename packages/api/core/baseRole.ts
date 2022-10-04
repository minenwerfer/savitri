import { Role } from '../types'

export default {
  capabilities: {
    meta: {
      methods: [
        'describeAll'
      ]
    },
    user: {
      methods: [
        'insert',
        'authenticate'
      ]
    },
    userExtra: {
      methods: [
        'insert'
      ]
    }
  }
} as Role
