import * as bcrypt from 'bcrypt'
import { createModel } from '../../../api/core/collection'
import { User, Description } from './user.schema'

export default createModel(Description, null, (schema) => { 
  schema.methods.testPassword = async function(candidate: string) {
    return bcrypt.compare(candidate, this.password || '')
  }

  schema.post('init', function(this: User) {
    this.full_name = `${this.first_name} ${this.last_name}`
  })
})
