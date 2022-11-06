import { createHash } from 'crypto'
const { writeFile, readFile, unlink } = require('fs').promises

import type { DecodedToken } from '../../../api/types'
import { Mutable } from '../../../api/core/controller'
import { File, Description } from './file.schema'
import FileModel from './file.model'

const { STORAGE_PATH } = process.env

export class FileController extends Mutable<File> {
  constructor() {
    super(FileModel, Description)
  }

  public override async insert(
    props: {
      what: { content: string } & Pick<File,
        '_id'
        | 'filename'
        | 'owner'
        | 'absolute_path'
      >
    },
    token: DecodedToken
  ) {
    if( !STORAGE_PATH ) {
      throw new Error('STORAGE_PATH is not set in the environment')
    }

    const what = Object.assign({}, props.what)
    what.owner = token.user._id

    const extension = what.filename?.split('.').pop()
    if( !extension ) {
      throw new Error('filename lacks extension')
    }

    const oldFile = await FileModel.findOne({ _id: props.what._id })
    if( oldFile ) {
      if( oldFile.immutable === true ) {
        throw new Error('você não pode mais editar esse arquivo')
      }

      try {
        await unlink(oldFile.absolute_path)

      } catch( error ) {
        console.trace(error)
      }
    }

    const filenameHash = createHash('sha1')
      .update(what.filename + Date.now())
      .digest('hex')

    what.absolute_path = `${STORAGE_PATH}/${filenameHash}.${extension}`
    await writeFile(what.absolute_path, Buffer.from(what.content.split(',').pop()!, 'base64'))

    return super.insert.call(this, { what }, token)
  }

  public override async delete(props: { filters: any }) {
    const file = await FileModel.findOne(props.filters)
    if( !file ) {
      throw new Error('file not found')
    }

    await unlink(file.absolute_path)
      .catch(() => null)

    return super.delete.call(this, props)
  }

  public async download(_id: string): Promise<Omit<File, 'content'> & { content: Buffer }> {
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
}
