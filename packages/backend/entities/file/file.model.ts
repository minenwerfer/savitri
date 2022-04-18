import { Document, model, options } from '../../src/database'
import { descriptionToSchema } from '../../src/entity'
import { default as Description } from './index.json'

import { UserDocument } from '../user/user.model'
import '../user/user.model'

export interface FileDocument extends Document {
  user_id: UserDocument
  filename: string;
  mime: string;
  size: number;
  content: string;
  context: string;
  absolute_path: string;
  relative_path: string;
  last_modified: Date;
  immutable: boolean;
}


export const FileSchema = descriptionToSchema<FileDocument>(Description, options)
export const File = model<FileDocument>('File', FileSchema)
