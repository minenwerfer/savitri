import { UserDocument } from '../models/User';
import { Mutable } from './abstract/Mutable';
/**
 * @exports
 * @class
 * User controller. Must provide methods for authentication, access level, etc.
 */
export declare class UserController extends Mutable<UserDocument> {
    constructor();
    insert(props: {
        what: any;
    }): Promise<any>;
    /**
     * @method
     * @param {string} username - string to match email or another field
     * @param {string} password - plain text password
     */
    authenticate(props: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
}
