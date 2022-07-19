import { Document, model, options } from '../../api/core/database'
import { descriptionToSchema } from '../../api/core/collection'
import { default as Description } from './index.json'

export type AccessProfileDocument = Record<string, Array<string>> & Document

export const AccessProfileSchema = descriptionToSchema<any>(Description, options)
export const AccessProfile = model<AccessProfileDocument>('accessProfile', AccessProfileSchema)
