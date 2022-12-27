import * as bcrypt from 'bcrypt'
import { createModel } from '../../../api/core/collection'
import UserDescription from './user.description'

export default createModel(UserDescription, {
  schemaCallback: (schema) => { 
    schema.virtual('full_name').get(function() {
      this.full_name = `${this.first_name||'N/A'} ${this.last_name||'N/A'}`
    })

    schema.methods.testPassword = function(candidate: string) {
      return bcrypt.compare(candidate, this.password || '')
    }
  }
})
