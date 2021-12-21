import { Module, ActionProps } from 'frontend/store/module';
export declare class AccessModule extends Module<{}, {}> {
    constructor();
    actions(this: AccessModule): {
        spawnAdd: ({ commit }: ActionProps) => void;
        spawnEdit: ({ commit }: ActionProps, { payload }: {
            payload: any;
        }) => void;
    };
}
