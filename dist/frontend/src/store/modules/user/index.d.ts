import { Module, ActionProps } from 'frontend/store/module';
/**
 * @exports @interface
 * User metadata.
 */
export interface User {
    current: {
        token: string;
        level: string[];
    };
}
/**
 * @exports @interface
 * User item.
 */
export interface UserItem {
    name?: string;
    email: string;
    active?: boolean;
    level?: number;
    password: string;
}
/**
 * @exports @const
 * Initial state.
 */
export declare const initialState: {
    current: {
        email: string;
        password: string;
        token: string;
        level: never[];
    };
};
/**
 * @exports @const
 * Initial item state.
 */
export declare const initialItemState: {
    email: string;
    password: string;
};
/**
 * @exports @class
 * User module.
 */
export declare class UserModule extends Module<User, UserItem> {
    constructor();
    actions(this: UserModule): {
        authenticate: ({ commit, dispatch, state: { current } }: ActionProps) => Promise<void>;
    };
    getters(): {
        token: (state: any) => any;
    };
    mutations(): {
        USER_AUTH(state: any, value: {
            token: string;
        }): void;
    };
}
