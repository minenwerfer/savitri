import { Document, model, options } from '../../database'
import { descriptionToSchema } from '../_Util'
import { default as Description } from '../../../../data/models/common/File/index.json'
export { Description }

import { UserDocument } from '../User'
import '../User'

export interface FileDocument extends Document {
  user_id: UserDocument;
  absolute_path: string;
  relative_path: string;
}

export const FileSchema = descriptionToSchema<FileDocument>(Description, options)
export const File = model<FileDocument>('File', FileSchema)
