/**
 * @exports @class
 * IndexedDB frontend.
 */
export declare class OfflineStorage {
    private _name;
    private _version;
    private _objectStores;
    private _objectStore;
    private _db;
    constructor(params: {
        name: string;
        version: number;
        objectStores: string[];
    });
    initialize(objectStore?: string): Promise<void>;
    switchObjectStore(name: string): Promise<void>;
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<any>;
    remove(key: string): Promise<any>;
    clear(): Promise<any>;
}
