/**
 * @exports @class
 * IndexedDB web.
 */
export class OfflineStorage {
  private _name: string;
  private _version: number;
  private _objectStores: Array<string>
  private _objectStore: string = ''
  private _db: any = {}

  constructor(params: { name: string, version: number, objectStores: Array<string> }) {
    this._name = params.name;
    this._version = params.version;
    this._objectStores = params.objectStores;

    if( process.env.NODE_ENV === 'development' ) {
      console.log(`DB instanciado com versão ${params.version}`)
    }
  }

  public initialize(objectStore?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this._name, this._version)
      if( objectStore ) {
        this._objectStore = objectStore
      }
      
      request.onupgradeneeded = () => {
        this._db = request.result
        this._objectStores.forEach((store) => {
          if( !request.result.objectStoreNames.contains(store) ) {
            request.result.createObjectStore(store)
          }
        });

        (request.transaction||{ oncomplete: false }).oncomplete = () => resolve()
      }

      request.onsuccess = () => {
        this._db = request.result
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  public switchObjectStore(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if( this._db ) {
        this._objectStore = name
        return resolve()
      }

      this.initialize()
        .then(() => {
          this._objectStore = name
          resolve()
        })
        .catch((error) => {
          indexedDB.deleteDatabase(this._name)
          sessionStorage.setItem('noIdb', 'true')

          reject(error)
        })
    })
  }

  public get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this._db
        .transaction(this._objectStores, 'readonly')
        .objectStore(this._objectStore)
        .get(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  public set(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this._db
        .transaction(this._objectStores, 'readwrite')
        .objectStore(this._objectStore)
        .put(value, key)

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
  }

  public remove(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this._db
        .transaction(this._objectStores, 'readwrite')
        .objectStore(this._objectStore)
        .delete(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  public clear(): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this._db
        .transaction(this._objectStores, 'readwrite')
        .objectStore(this._objectStore)
        .clear()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}
