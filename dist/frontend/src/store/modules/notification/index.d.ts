import { Module, CommonState, MutationProps } from 'frontend/store/module';
export declare const initialState: {
    messages: never[];
};
export declare class NotificationModule extends Module<{}, {}> {
    constructor();
    getters(): {
        unread: (state: any) => any;
    };
    actions(this: NotificationModule): {
        ping: ({ commit, dispatch, state }: import("frontend/store/module").ContextFunctions & {
            state: any;
        }, value?: any) => Promise<unknown>;
        notify: ({ commit, dispatch, state }: import("frontend/store/module").ContextFunctions & {
            state: any;
        }, value?: any) => Promise<unknown>;
    };
    mutations(this: NotificationModule): {
        NOTIFICATION_PING: (state: CommonState & {
            messages: [];
        }, { result }: MutationProps) => void;
    };
}
