import * as bcrypt from 'bcrypt'

import { createModel, MongoDocument } from '../../api'
import { default as Description } from './index.json'

export type UserDocument = MongoDocument & {
  first_name: string
  last_name: string
  full_name: string
  email: string
  password?: string
  active?: boolean
  role: string
  testPassword: (password: string) => boolean
}

export default createModel<UserDocument>('user', Description, null, (schema) => {
  schema.methods.testPassword = async function(candidate: string) {
    return bcrypt.compare(candidate, this.password || '')
  }

  schema.post('init', function(this: UserDocument) {
    this.full_name = `${this.first_name} ${this.last_name||''}`
  })
})
