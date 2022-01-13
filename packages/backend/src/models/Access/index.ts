import { Document, model } from '../../database'
import { descriptionToSchema } from '../_Util'
import { default as Description } from '../../../../data/entities/common/Access/index.json'
export { Description }

export type AccessDocument = any & Document;

export const AccessSchema = descriptionToSchema<any>(Description)
export const Access = model<AccessDocument>('Access', AccessSchema)
