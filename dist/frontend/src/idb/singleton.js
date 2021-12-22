"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistentStorage = void 0;
const index_1 = require("./index");
class PersistentStorage extends index_1.OfflineStorage {
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
exports.PersistentStorage = PersistentStorage;
