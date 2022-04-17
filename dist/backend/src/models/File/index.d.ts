/// <reference types="mongoose" />
import { Document } from '../../database';
import { default as Description } from '../../../../data/entities/common/File/index.json';
export { Description };
import { UserDocument } from '../User';
import '../User';
export interface FileDocument extends Document {
    user_id: UserDocument;
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
export declare const FileSchema: import("mongoose").Schema<FileDocument, import("mongoose").Model<FileDocument, any, any, any>, any>;
export declare const File: import("mongoose").Model<FileDocument, {}, {}, {}>;
