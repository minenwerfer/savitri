import type { MongoDocument } from '../../api/types'
import { model, options } from '../../api/core/database'
import { descriptionToSchema } from '../../api/core/collection'
import { default as Description } from './index.json'

export type AccessProfileDocument = MongoDocument & {
  name: string
  visibility: string
  capabilities: Record<string, Array<string>>
}

export const AccessProfileSchema = descriptionToSchema<any>(Description, options)
export const AccessProfile = model<AccessProfileDocument>('accessProfile', AccessProfileSchema)
