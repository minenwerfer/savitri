import * as bcrypt from 'bcrypt'

import type { MongoDocument } from '../../api/types'
import { model, options } from '../../api/core/database'
import { descriptionToSchema } from '../../api/core/collection'
import { default as Description } from './index.json'

import { AccessProfileDocument } from '../accessProfile/accessProfile.model'
import '../accessProfile/accessProfile.model'

export type User = {
  name: string
  first_name: string
  email: string
  password?: string
  active: boolean
  access?: AccessProfileDocument
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
  this.first_name = this.name?.split(' ')[0]
})

/**
 * @exports
 * User model.
 */
export const User = model<UserDocument>('user', UserSchema)

