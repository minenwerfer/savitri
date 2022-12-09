import type { CollectionFunction } from '../../../../api/types'
import FileModel from '../file.model'

const { readFile } = require('fs').promises

const download: CollectionFunction<string> = async (_id): Promise<Omit<File, 'content'> & { content: Buffer }> => {
  const file = await FileModel.findOne({ _id }).lean()
  if( !file ) {
    throw new Error('file not found')
  }

  const content = await readFile(file.absolute_path)
  return {
    ...file,
    content: Buffer.from(content, 'base64')
  }
}

export default download
