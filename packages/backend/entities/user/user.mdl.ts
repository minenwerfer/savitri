import * as bcrypt from 'bcrypt'

import { Document, model, options } from '../../src/database'
import { descriptionToSchema } from '../../src/entity'
import { default as Description } from './index.json'

import { AccessProfileDocument } from '../accessProfile/accessProfile.mdl'
import '../accessProfile/accessProfile.mdl'

export interface User {
  name: string
  first_name: string
  email: string
  password?: string
  active: boolean
  access?: AccessProfileDocument[]
}

export type UserDocument = User & Document & {
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

UserSchema.post('init', function() {
  this.first_name = this.name?.split(' ')[0]
})

/**
 * @exports
 * User model.
 */
export const User = model<UserDocument>('User', UserSchema)

