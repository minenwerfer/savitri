import 'common/polyfill';
import { RouterExtension } from './router';
import { StoreExtension } from './store';
import 'frontend/../assets/tailwind.css';
import 'frontend/../assets/main.css';
export * from 'vue';
interface AppOptions {
    component: any;
    i18n?: any;
    menuSchema?: any;
    routerExtension?: RouterExtension;
    storeExtension?: StoreExtension;
}
export declare const useApp: (config: AppOptions) => Promise<any>;
