import { Module } from 'frontend/store/module';
export declare class ShipmentModule extends Module<{}, {}> {
    constructor();
    actions(this: any): {
        downloadFiles: ({}: {}, { payload }: any) => void;
        downloadDaily: ({}: {}, { payload }: any) => void;
    };
}
