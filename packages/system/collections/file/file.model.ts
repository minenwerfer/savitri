import { createModel } from '../../../api/core/collection'
import { File, FileDescription } from './file.schema'

import '../user/user.model'

export default createModel(FileDescription, null, (schema) => {
  schema.post('init', async function() {
    const timestamp = this.last_modified
      ? new Date(this.last_modified).getTime()
      : 'fresh'

    const link = `${process.env.API_URL}/file/${this._id}`

    this.link = `${link}?${timestamp}`
    this.download_link = `${link}/download?${timestamp}`
  })
})

