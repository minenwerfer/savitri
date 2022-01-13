/// <reference types="mongoose" />
import { Document } from '../../database';
import { default as Description } from '../../../../data/entities/common/User/index.json';
export { Description };
import { AccessDocument } from '../Access';
import '../Access';
export interface UserDocument extends Document {
    email: string;
    password: string;
    active: boolean;
    access: AccessDocument[];
    testPassword: (password: string) => boolean;
}
export declare const UserSchema: import("mongoose").Schema<UserDocument, import("mongoose").Model<UserDocument, any, any, any>, any>;
/**
 * @exports
 * User model.
 */
export declare const User: import("mongoose").Model<UserDocument, {}, {}, {}>;
