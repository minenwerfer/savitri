import { RequestProvider, AxiosResponse } from 'common/http';
export declare const PZ_API_URL: string;
export declare type DispatchFunction = (action: string, payload?: any, options?: any) => Promise<any> | any;
export declare type CommitFunction = DispatchFunction;
/**
 * @exports @interface
 * Action properties.
 */
export interface ActionProps {
    state: any;
    getters: any;
    rootGetters: any;
    commit: CommitFunction;
    dispatch: DispatchFunction;
}
/**
 * @exports @interface
 * Object passed to commit() when _actionHelper succeeds.
 */
export interface MutationProps {
    result?: any;
    props?: any;
    payload: {
        filter?: any | any[];
    };
}
/**
 * @exports @interface
 * Will add the dispatcher function as the first argument for spawning errors.
 */
export interface ProxiedRequestProvider {
    post: (commit: CommitFunction, route: string, payload: any) => Promise<AxiosResponse>;
    get: (commit: CommitFunction, route: string) => Promise<AxiosResponse>;
}
/**
 * @exports @abstract @class
 * Generic module with useful helpers.
 */
export declare abstract class Module<T = any, Item = any> {
    private _moduleInstance;
    private _route;
    protected _http: RequestProvider;
    protected _proxiedHttp: RequestProvider & ProxiedRequestProvider;
    private _initialState;
    private _initialItemState;
    private _commonState;
    namespaced: boolean;
    /**
     * @constructor
     * Creates a proxy whose function is to merge common props with the child's ones.
     *
     * @param {object} initialState - initial state
     * @param {string} route - API route
     */
    constructor(route: string, initialState: T, initialItemState: Item);
    get module(): Module<T, Item>;
    get http(): ProxiedRequestProvider;
    protected route(verb: string): string;
    protected _actionHelper<T_>(verb: string, mutation?: string, transform?: (what: any) => any): ({ commit, dispatch, state }: ActionProps, value?: any) => Promise<T_>;
    protected _parseQuery(obj: any, array?: boolean): Promise<any>;
    state(): any;
    private _getters;
    private _actions;
    private _mutations;
}
