/// <reference types="mongoose" />
import { Document } from '../../database';
import { default as Description } from '../../../../data/models/common/Access/index.json';
export { Description };
export declare type AccessDocument = any & Document;
export declare const AccessSchema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any>, any>;
export declare const Access: import("mongoose").Model<any, {}, {}, {}>;
