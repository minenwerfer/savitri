import { UserDocument, User } from './user.model';
import { Mutable } from '../../core/controller';
/**
 * @exports
 * @class
 * User controller. Must provide methods for authentication, access level, etc.
 */
export declare class UserController extends Mutable<UserDocument> {
    constructor();
    insert(props: {
        what: any;
    }, res: unknown, decodedToken: any): Promise<any>;
    /**
     * @method
     * @param {string} username - string to match email or another field
     * @param {string} password - plain text password
     */
    authenticate(props: {
        email: string;
        password: string;
    }): Promise<User & {
        token: string;
    }>;
}
