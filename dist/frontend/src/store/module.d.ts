import { RequestProvider, AxiosResponse } from 'common/http';
export declare const SV_API_URL: string;
export declare const SV_API_URL_2: string;
export declare type DispatchFunction = (action: string, payload?: any, options?: any) => Promise<any> | any;
export declare type CommitFunction = DispatchFunction;
/**
 * @exports @interface
 * Dispatch and commit functions.
 */
export interface ContextFunctions {
    commit: CommitFunction;
    dispatch: DispatchFunction;
}
/**
 * @exports @interface
 * Action properties.
 */
export declare type ActionProps = ContextFunctions & {
    state: CommonState;
    getters?: any;
    rootGetters?: any;
};
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
    post: (ctx: ContextFunctions, route: string, payload: any) => Promise<AxiosResponse>;
    get: (ctx: ContextFunctions, route: string) => Promise<AxiosResponse>;
}
export interface CommonState {
    isLoading: boolean;
    item: any;
    items: any[];
    recordsCount: number;
    recordsTotal: number;
    _clearItem: any;
    _offset: number;
    _limit: number;
    _halt: boolean;
    _filters: any;
    _queryCache: any;
    __description: any;
    _description: {
        actions?: any;
        individualActions?: any;
        fields?: any;
        table?: string[];
        filters?: any;
    };
    selected: any[];
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
     * @param {string} route - API route
     * @param {object} initialState - initial state
     * @param {object} initialItemState - initial item state
     * @param {string} apiUrl - URL to be used in place of SV_API_URL
     */
    constructor(route: string, initialState: T, initialItemState: Item, apiUrl?: string);
    get module(): Module<T, Item>;
    get http(): ProxiedRequestProvider;
    protected route(verb: string): string;
    protected _actionHelper<T_>(verb: string, mutation?: string, transform?: (what: any) => any): ({ commit, dispatch, state }: ContextFunctions & {
        state: any;
    }, value?: any) => Promise<T_>;
    protected _parseQuery(obj: any, array?: boolean): Promise<any>;
    state(): {
        isLoading: boolean;
        item: any;
        items: any[];
        recordsCount: number;
        recordsTotal: number;
        _clearItem: any;
        _offset: number;
        _limit: number;
        _halt: boolean;
        _filters: any;
        _queryCache: any;
        __description: any;
        _description: {
            actions?: any;
            individualActions?: any;
            fields?: any;
            table?: string[] | undefined;
            filters?: any;
        };
        selected: any[];
    } & T & {
        item: Item;
    };
    private _getters;
    private _actions;
    private _mutations;
}
