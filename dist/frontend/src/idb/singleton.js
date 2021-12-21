import { OfflineStorage } from './index';
export class PersistentStorage extends OfflineStorage {
    static instance;
    constructor() {
        if (PersistentStorage.instance) {
            return PersistentStorage.instance;
        }
        const options = {
            name: 'store',
            version: 1,
            objectStores: []
        };
        super(options);
        PersistentStorage.instance = this;
    }
}
