import { Module } from '../module';
export declare class ReportModule extends Module<{}, {}> {
    constructor();
    actions(): {
        download: ({}: {}, { payload }: any) => void;
    };
}
