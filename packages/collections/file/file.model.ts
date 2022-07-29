import type { MongoDocument } from '../../api/types'
import { model, options } from '../../api/core/database'
import { descriptionToSchema } from '../../api/core/collection'
import { default as Description } from './index.json'

import { UserDocument } from '../user/user.model'
import '../user/user.model'

export type FileDocument = MongoDocument & {
  user_id: UserDocument
  filename: string
  mime: string
  size: number
  content: string
  context: string
  absolute_path: string
  relative_path: string
  last_modified: Date
  immutable: boolean
}


export const FileSchema = descriptionToSchema<FileDocument>(Description, options)
export const File = model<FileDocument>('file', FileSchema)
