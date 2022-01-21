/// <reference types="mongoose" />
import { Model, Query } from '../../database';
import { Controller } from './Controller';
export declare const PAGINATION_LIMIT: string | undefined;
export declare type SingleQuery<T> = Query<(T & {
    _id: any;
}), T & {
    _id: any;
}, {}, T>;
export declare type MultipleQuery<T> = Query<(T & {
    _id: any;
})[], T & {
    _id: any;
}, {}, T>;
export declare abstract class Mutable<T> extends Controller<T> {
    /**
     * @constructor
     * @param {Model<T>} model - a singleton instance of Model<T>
     */
    constructor(model: Model<T>, description: object, options?: {});
    /**
     * @method
     * Inserts a single document in the database.
     */
    insert(props: {
        what: T & {
            _id?: string;
        };
    }, response?: unknown, token?: any): any | Promise<any>;
    count(props: {
        filters?: object;
    }): Query<number, import("mongoose").HydratedDocument<T, {}, {}>, {}, T>;
    /**
     * @method
     * Gets a document from database.
     */
    get(props: {
        filters?: object;
    }): any | Promise<any>;
    /**
     * @method
     * Gets a collection of documents from database.
     */
    getAll(props: {
        filters?: object;
        offset?: number;
        limit?: number;
        sort?: any;
    }): MultipleQuery<T> | Promise<MultipleQuery<T>>;
    /**
     * @method
     * Removes a document from database.
     */
    remove(props: {
        filters: any;
    }): any | Promise<any>;
    /**
     * @method
     * Removing all documents from database matching the criteria.
     */
    removeAll(props: {
        filters: any;
    }): Query<import("mongodb").DeleteResult, import("mongoose").HydratedDocument<T, {}, {}>, {}, T>;
    /**
     * @method
     * Modify a single document.
   */
    modify(props: {
        filters: any;
        what: any;
    }): any | Promise<any>;
    /**
     * @method
     * Modify documents matching criteria.
     */
    modifyAll(props: {
        filters: any[];
        what: any;
    }): Query<import("mongodb").UpdateResult, import("mongoose").HydratedDocument<T, {}, {}>, {}, T>;
}
