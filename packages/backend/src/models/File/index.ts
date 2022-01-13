import { Document, model, options } from '../../database'
import { descriptionToSchema } from '../_Util'
import { default as Description } from '../../../../data/entities/common/File/index.json'
export { Description }

import { UserDocument } from '../User'
import '../User'

export interface FileDocument extends Document {
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
