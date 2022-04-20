import { Server } from '@hapi/hapi';
import '../../common/src/polyfill';
export declare const init: (port?: number) => Promise<Server>;
