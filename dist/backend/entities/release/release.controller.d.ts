import { Controller } from '../../core/controller';
export declare class ReleaseController extends Controller<unknown> {
    constructor();
    getAll(): Promise<{
        base: any;
        product: any;
    }>;
}
