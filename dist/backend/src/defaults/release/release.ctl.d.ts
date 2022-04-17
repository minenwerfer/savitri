import { Controller } from '../../controller';
export declare class ReleaseController extends Controller<unknown> {
    constructor();
    getAll(): Promise<{
        base: any;
        product: any;
    }>;
}
