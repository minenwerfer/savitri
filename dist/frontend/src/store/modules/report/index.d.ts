import { Module } from 'frontend/store/module';
export declare class ReportModule extends Module<{}, {}> {
    constructor();
    actions(): {
        download: ({}: {}, { payload }: any) => void;
    };
}
