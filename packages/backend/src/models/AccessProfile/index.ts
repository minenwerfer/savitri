import { Document, model } from '../../database'
import { descriptionToSchema } from '../_Util'
import { default as Description } from '../../../../data/entities/common/AccessProfile/index.json'
export { Description }

export type AccessProfileDocument = any & Document;

export const AccessProfileSchema = descriptionToSchema<any>(Description)
export const AccessProfile = model<AccessProfileDocument>('AccessProfile', AccessProfileSchema)
