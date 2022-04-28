import { Document, model, options } from '../../core/database'
import { descriptionToSchema } from '../../core/entity'
import { default as Description } from './index.json'

export type AccessProfileDocument = any & Document;

export const AccessProfileSchema = descriptionToSchema<any>(Description, options)
export const AccessProfile = model<AccessProfileDocument>('AccessProfile', AccessProfileSchema)
