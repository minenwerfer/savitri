import { Module, CommonState, MutationProps } from 'frontend/store/module';
export declare class NotificationModule extends Module<{}, {}> {
    constructor();
    actions(this: NotificationModule): {
        ping: ({ commit, dispatch, state }: import("frontend/store/module").ActionProps, value?: any) => Promise<unknown>;
    };
    mutations(this: NotificationModule): {
        NOTIFICATION_PING: (state: CommonState, { result }: MutationProps) => void;
    };
}
