/// <reference types="node" />
/// <reference types="packages/backend/node_modules/mongoose" />
import { FileDocument } from './file.mdl';
import { Mutable, SingleQuery } from '../../controller';
export declare class FileController extends Mutable<FileDocument> {
    constructor();
    insert(props: {
        what: any;
    }, res: unknown, decodedToken: any): Promise<any>;
    remove(props: {
        filters: any;
    }): Promise<SingleQuery<FileDocument> | void>;
    download(_id: string): Promise<{
        content: Buffer;
        mime: string;
        _id: any;
        __v?: any;
        id?: any;
        immutable: boolean;
        filename: string;
        user_id: import("mongoose").LeanDocument<import("../user/user.mdl").UserDocument>;
        size: number;
        context: string;
        absolute_path: string;
        relative_path: string;
        last_modified: Date;
    }>;
}
