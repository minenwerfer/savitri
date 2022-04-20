import { Controller } from './index';
export declare class ApplicationController extends Controller<unknown> {
    constructor();
    private _replacePlaceholders;
    manifest(): any;
    serviceWorker(): Promise<any>;
    index(): Promise<string>;
}
