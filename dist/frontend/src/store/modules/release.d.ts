import { Module } from '../module';
export declare class ReleaseModule extends Module<{}, {}> {
    constructor();
    mutations(): {
        ITEMS_GET: (state: any, { result }: {
            result: any;
        }) => void;
    };
}
