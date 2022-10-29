import { createModel, MongoDocument } from '../../../api'
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


export default createModel('file', Description, null, (schema) => {
  schema.post('init', async function() {
    const timestamp = this.last_modified
      ? new Date(this.last_modified).getTime()
      : 'fresh'

    const link = `${process.env.API_URL}/file/${this._id}`

    this.link = `${link}?${timestamp}`
    this.download_link = `${link}/download?${timestamp}`
  })
})
