import { Store } from 'vuex';
export declare const instance: () => Store<any>;
export declare type StoreExtension = any;
export declare const extendStore: (store: Store<any>, storeExtension: StoreExtension) => void;
