import { createModel } from '../../../api/core/collection'
import { File, default as FileDescription } from './file.description'
const { unlink } = require('fs').promises

import '../user/user.model'

const link = (_id: File['_id']) => `${process.env.API_URL}/file/${_id}`

const timestamp = (last_modified: Date) => last_modified
  ? new Date(last_modified).getTime()
  : 'fresh'

const deleteFile = (path: string) => {
  return unlink(path).catch(() => null)
}

export default createModel(FileDescription, {
  schemaCallback: (schema) => {
    schema.pre('deleteOne', async function() {
      const doc = await this.model
        .findOne(this.getQuery, { absolute_path: 1 })
        .lean()

      await deleteFile(doc.absolute_path)
    })

    schema.pre('deleteMany', async function() {
      const results = await this.model
        .find(this.getQuery(), { absolute_path: 1 })
        .lean()

      for( const doc of results ) {
        await deleteFile(doc.absolute_path)
      }
    })

    schema.virtual('link').get(function(this: File) {
      return `${link(this._id)}?${timestamp(this.last_modified)}`
    })

    schema.virtual('download_link').get(function(this: File) {
      return `${link(this._id)}/download?${timestamp(this.last_modified)}`
    })
  }
})

