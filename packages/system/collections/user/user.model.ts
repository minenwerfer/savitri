import * as bcrypt from 'bcrypt'
import { createModel } from '../../../api/core/collection'
import { User, UserDescription } from './user.description'

export default createModel(UserDescription, null, (schema) => { 
  schema.methods.testPassword = function(candidate: string) {
    return bcrypt.compare(candidate, this.password || '')
  }

  schema.post('init', function(this: User) {
    this.full_name = `${this.first_name||'N/A'} ${this.last_name||'N/A'}`
  })
})
