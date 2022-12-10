import type { ApiFunction } from '../../../../api/types'
import { useCollection } from '../../../../api'
import FileModel from '../file.model'

const { unlink } = require('fs').promises

type Props = {
  filters: {
    _id: string
  }
}

const _delete: ApiFunction<Props> = async (props, token, ctx) => {
  const file = await FileModel.findOne(props.filters)
  if( !file ) {
    throw new Error('file not found')
  }

  await unlink(file.absolute_path).catch(() => null)
  return useCollection('file', ctx).delete(props, token)
}

export default _delete
