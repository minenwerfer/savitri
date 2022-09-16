import * as bcrypt from 'bcrypt'

import type { MongoDocument } from '../../api/types'
import { model, options } from '../../api/core/database'
import { descriptionToSchema } from '../../api/core/collection'
import { default as Description } from './index.json'

export type User = {
  first_name: string
  last_name: string
  full_name: string
  email: string
  password?: string
  active?: boolean
  role: string
}

export type UserDocument = User & MongoDocument & {
  testPassword: (password: string) => boolean
}

export const UserSchema = descriptionToSchema<UserDocument>(Description, options)
UserSchema.plugin(require('mongoose-autopopulate'))

/**
 * @function
 * Will return true if password matches.
 */
UserSchema.methods.testPassword = async function(candidate: string) {
  return bcrypt.compare(candidate, this.password || '')
}

UserSchema.post('init', function(this: UserDocument) {
  this.full_name = `${this.first_name} ${this.last_name||''}`
})

/**
 * @exports
 * User model.
 */
export const User = model<UserDocument>('user', UserSchema)

