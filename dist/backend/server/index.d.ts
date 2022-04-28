import { Server } from '@hapi/hapi';
import '../../common/src/polyfill';
declare global {
    var modules: any[];
}
export declare const init: (props?: {
    port?: number | undefined;
    modules?: any[] | undefined;
} | undefined) => Promise<Server>;
