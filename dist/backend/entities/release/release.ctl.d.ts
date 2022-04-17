import { Controller } from '../../src/controller';
export declare class ReleaseController extends Controller<unknown> {
    constructor();
    getAll(): Promise<{
        base: any;
        product: any;
    }>;
}
