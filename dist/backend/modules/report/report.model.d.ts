/// <reference types="packages/backend/node_modules/mongoose" />
import { Document } from '../../core/database';
import { UserDocument } from '../user/user.model';
import '../user/user.model';
export interface ReportDocument extends Document {
    user_id: UserDocument | string;
    module: string;
}
export declare const ReportSchema: import("mongoose").Schema<ReportDocument, import("mongoose").Model<ReportDocument, any, any, any>, any, any>;
export declare const Report: import("mongoose").Model<ReportDocument, {}, {}, {}>;
