import { Module, ActionProps } from 'frontend/store/module';
export declare class AccessProfileModule extends Module<{}, {}> {
    constructor();
    actions(this: AccessProfileModule): {
        spawnAdd: ({ commit }: ActionProps) => void;
        spawnEdit: ({ commit }: ActionProps, { payload }: {
            payload: any;
        }) => void;
    };
}
