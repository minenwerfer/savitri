import { Module, CommonState, ActionProps } from '../module';
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
}
/**
 * @exports @const
 * Initial state.
 */
export declare const initialState: {
    current: {
        email: string;
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
    verification: string;
};
/**
 * @exports @class
 * User module.
 */
export declare class UserModule extends Module<User, UserItem> {
    constructor();
    actions(this: UserModule): {
        authenticate: ({ commit, dispatch, state: { current } }: import("../module").ContextFunctions & {
            state: CommonState;
            getters?: any;
            rootGetters?: any;
        } & {
            state: CommonState & {
                current: any;
            };
        }) => Promise<void>;
        signout: ({ commit }: ActionProps) => Promise<void>;
        spawnChangePwd: ({ commit }: ActionProps, { payload: { filters } }: {
            payload: {
                filters: any;
            };
        }) => void;
    };
    getters(): {
        token: (state: any) => any;
        current: () => any;
    };
    mutations(): {
        USER_AUTH(state: CommonState & {
            current: any;
        }, value: {
            token: string;
        }): void;
        CURRENT_UPDATE(state: CommonState & {
            current: any;
        }): void;
        USER_SIGNOUT(state: CommonState & {
            current: any;
        }): void;
    };
}
