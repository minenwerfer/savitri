import { Controller } from './abstract/Controller';
export declare class ReleaseController extends Controller<unknown> {
    constructor();
    getAll(): Promise<{
        base: any;
        product: any;
    }>;
}
