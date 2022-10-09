import type { MongoDocument } from '../../api/types'
import { model, options } from '../../api/core/database'
import { descriptionToSchema } from '../../api/core/collection'
import { default as Description } from './index.json'

import { UserDocument } from '../user/user.model'
import '../user/user.model'

export type FileDocument = MongoDocument & {
  owner: UserDocument
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


export const FileSchema = descriptionToSchema<FileDocument>(Description, options)
FileSchema.post('init', async function() {
  const timestamp = this.last_modified
    ? new Date(this.last_modified).getTime()
    : 'fresh'

  const link = `${process.env.API_URL}/file/${this._id}`

  this.link = `${link}?${timestamp}`
  this.download_link = `${link}/download?${timestamp}`
})

export const File = model<FileDocument>('file', FileSchema)
