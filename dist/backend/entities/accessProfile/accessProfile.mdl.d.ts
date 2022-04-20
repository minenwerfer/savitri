/// <reference types="packages/backend/node_modules/mongoose" />
import { Document } from '../../src/database';
export declare type AccessProfileDocument = any & Document;
export declare const AccessProfileSchema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any>, any, any>;
export declare const AccessProfile: import("mongoose").Model<any, {}, {}, {}>;
