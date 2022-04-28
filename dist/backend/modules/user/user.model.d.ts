/// <reference types="packages/backend/node_modules/mongoose" />
import { Document } from '../../core/database';
import { AccessProfileDocument } from '../accessProfile/accessProfile.model';
import '../accessProfile/accessProfile.model';
export interface User {
    name: string;
    first_name: string;
    email: string;
    password?: string;
    active: boolean;
    access?: AccessProfileDocument[];
}
export declare type UserDocument = User & Document & {
    testPassword: (password: string) => boolean;
};
export declare const UserSchema: import("mongoose").Schema<UserDocument, import("mongoose").Model<UserDocument, any, any, any>, any, any>;
/**
 * @exports
 * User model.
 */
export declare const User: import("mongoose").Model<UserDocument, {}, {}, {}>;
