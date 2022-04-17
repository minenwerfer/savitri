/// <reference types="mongoose" />
import { Document } from '../../database';
import { default as Description } from '../../../../data/entities/common/Report/index.json';
export { Description };
import { UserDocument } from '../User';
import '../User';
export interface ReportDocument extends Document {
    user_id: UserDocument | string;
    module: string;
}
export declare const ReportSchema: import("mongoose").Schema<ReportDocument, import("mongoose").Model<ReportDocument, any, any, any>, any>;
export declare const Report: import("mongoose").Model<ReportDocument, {}, {}, {}>;
