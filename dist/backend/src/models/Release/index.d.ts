/// <reference types="mongoose" />
import { Document } from '../../database';
import { default as Description } from '../../../../data/entities/common/Release/index.json';
export { Description };
import { UserDocument } from '../User';
import '../User';
export interface ReleaseDocument extends Document {
    user_id: UserDocument | string;
    module: string;
}
export declare const ReleaseSchema: import("mongoose").Schema<ReleaseDocument, import("mongoose").Model<ReleaseDocument, any, any, any>, any>;
export declare const Release: import("mongoose").Model<ReleaseDocument, {}, {}, {}>;
