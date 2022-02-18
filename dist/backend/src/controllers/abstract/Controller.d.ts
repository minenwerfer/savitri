import { Model } from '../../database';
export interface HandlerRequest {
    payload: {
        offset?: number;
        limit?: number;
        filters?: any;
        what?: any;
    };
}
export declare abstract class Controller<T> {
    private _webInterface;
    private _description;
    protected _model: Model<T>;
    /**
     * @protected @readonly
     * Supposed to contain method names as strings.
     */
    protected readonly _internal: string[];
    protected _publicMethods: string[];
    protected _rawMethods: {
        [key: string]: string;
    };
    protected _forbiddenMethods: string[];
    /**
     * @constructor
     * Sets controller metadata and creates a proxy that passes
     * req.payload instead of req as first parameter and forbiddens call if
     * user hasn't the capability set.
     */
    constructor(props: {
        description?: any;
        forbiddenMethods?: string[];
        publicMethods?: string[];
        rawMethods?: {
            [key: string]: string;
        };
    });
    rawType(verb: string): string | undefined;
    get webInterface(): Controller<T>;
    /**
     * @virtual @method
     * Describes the controller.
     */
    describe(): object;
    forward(this: any, route: string, props: any, decodedToken: any): Promise<any>;
}
