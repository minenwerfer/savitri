import { Role } from '../types'

export default {
  capabilities: {
    meta: {
      methods: [
        'describeAll'
      ]
    },
    file: {
      methods: [
        'insert'
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
