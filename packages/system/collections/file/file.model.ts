import { createModel, MongoDocument, ObjectId } from '../../../api'
import { default as Description } from './index.json'

export type FileDocument = MongoDocument & {
  owner: UserDocument|ObjectId|string
  filename: string
  mime: string
  size: number
  content: string
  absolute_path: string
  relative_path: string
  last_modified: Date
  link?: string
  download_link?: string
  immutable: boolean
}

