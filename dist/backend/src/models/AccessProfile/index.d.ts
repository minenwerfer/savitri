/// <reference types="mongoose" />
import { Document } from '../../database';
import { default as Description } from '../../../../data/entities/common/AccessProfile/index.json';
export { Description };
export declare type AccessProfileDocument = any & Document;
export declare const AccessProfileSchema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any>, any>;
export declare const AccessProfile: import("mongoose").Model<any, {}, {}, {}>;
