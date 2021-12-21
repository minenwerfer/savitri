import * as bcrypt from 'bcrypt'
import { Document, model, options } from '../../database'
import { descriptionToSchema } from '../_Util'
import { default as Description } from '../../../../data/models/common/User/index.json'
export { Description }

import { AccessDocument } from '../Access'
import '../Access'

export interface UserDocument extends Document {
  email: string,
  password: string,
  active: boolean,
  access: AccessDocument[],
  testPassword: (password: string) => boolean;
}

export const UserSchema = descriptionToSchema<UserDocument>(Description, options)
UserSchema.plugin(require('mongoose-autopopulate'))

/**
 * @function
 * Will hash password before it's saved.
 */
UserSchema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 10) 
})

/**
 * @function
 * Will return true if password matches.
 */
UserSchema.methods.testPassword = async function(candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

/**
 * @exports
 * User model.
 */
export const User = model<UserDocument>('User', UserSchema)

