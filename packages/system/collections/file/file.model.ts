import { createModel } from '../../../api/core/collection'
import { File, default as FileDescription } from './file.description'

import '../user/user.model'

export default createModel(FileDescription, {
  schemaCallback: (schema) => {
    const link = (_id: File['_id']) => `${process.env.API_URL}/file/${_id}`

    const timestamp = (last_modified: Date) => last_modified
      ? new Date(last_modified).getTime()
      : 'fresh'

      schema.virtual('link').get(function(this: File) {
        return `${link(this._id)}?${timestamp(this.last_modified)}`
      })

      schema.virtual('download_link').get(function(this: File) {
        return `${link(this._id)}/download?${timestamp(this.last_modified)}`
      })
  }
})

