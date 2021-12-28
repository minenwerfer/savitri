/// <reference types="mongoose" />
import { Document } from '../../database';
import { default as Description } from '../../../../data/models/common/File/index.json';
export { Description };
import { UserDocument } from '../User';
import '../User';
export interface FileDocument extends Document {
    user_id: UserDocument;
    absolute_path: string;
    relative_path: string;
}
export declare const FileSchema: import("mongoose").Schema<FileDocument, import("mongoose").Model<FileDocument, any, any, any>, any>;
export declare const File: import("mongoose").Model<FileDocument, {}, {}, {}>;
