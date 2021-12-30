"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineStorage = void 0;
/**
 * @exports @class
 * IndexedDB frontend.
 */
class OfflineStorage {
    _name;
    _version;
    _objectStores;
    _objectStore = '';
    _db = {};
    constructor(params) {
        this._name = params.name;
        this._version = params.version;
        this._objectStores = params.objectStores;
        if (process.env.NODE_ENV === 'development') {
            console.log(`DB instanciado com versão ${params.version}`);
        }
    }
    initialize(objectStore) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this._name, this._version);
            if (objectStore) {
                this._objectStore = objectStore;
            }
            request.onupgradeneeded = () => {
                this._db = request.result;
                this._objectStores.forEach((store) => {
                    if (!request.result.objectStoreNames.contains(store)) {
                        request.result.createObjectStore(store);
                    }
                });
                (request.transaction || { oncomplete: false }).oncomplete = () => resolve();
            };
            request.onsuccess = () => {
                this._db = request.result;
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }
    switchObjectStore(name) {
        return new Promise((resolve, reject) => {
            if (this._db) {
                this._objectStore = name;
                return resolve();
            }
            this.initialize()
                .then(() => {
                this._objectStore = name;
                resolve();
            })
                .catch((error) => {
                indexedDB.deleteDatabase(this._name);
                sessionStorage.setItem('noIdb', 'true');
                reject(error);
            });
        });
    }
    get(key) {
        return new Promise((resolve, reject) => {
            const request = this._db
                .transaction(this._objectStores, 'readonly')
                .objectStore(this._objectStore)
                .get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    set(key, value) {
        return new Promise((resolve, reject) => {
            const request = this._db
                .transaction(this._objectStores, 'readwrite')
                .objectStore(this._objectStore)
                .put(value, key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    remove(key) {
        return new Promise((resolve, reject) => {
            const request = this._db
                .transaction(this._objectStores, 'readwrite')
                .objectStore(this._objectStore)
                .delete(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    clear() {
        return new Promise((resolve, reject) => {
            const request = this._db
                .transaction(this._objectStores, 'readwrite')
                .objectStore(this._objectStore)
                .clear();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}
exports.OfflineStorage = OfflineStorage;
//# sourceMappingURL=index.js.map