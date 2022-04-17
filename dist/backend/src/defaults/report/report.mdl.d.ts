/// <reference types="packages/backend/node_modules/mongoose" />
import { Document } from '../../database';
import { default as Description } from './index.json';
export { Description };
import { UserDocument } from '../user/user.mdl';
import '../user.mdl';
export interface ReportDocument extends Document {
    user_id: UserDocument | string;
    module: string;
}
export declare const ReportSchema: import("mongoose").Schema<ReportDocument, import("mongoose").Model<ReportDocument, any, any, any>, any, any>;
export declare const Report: import("mongoose").Model<ReportDocument, {}, {}, {}>;
