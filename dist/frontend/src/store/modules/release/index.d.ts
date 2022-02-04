import { Module } from 'frontend/store/module';
export declare class ReleaseModule extends Module<{}, {}> {
    constructor();
    mutations(): {
        ITEMS_GET: (state: any, { result }: {
            result: any;
        }) => void;
    };
}
