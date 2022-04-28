import { Controller } from '../../core/controller';
export declare class ApplicationController extends Controller<unknown> {
    constructor();
    private _replacePlaceholders;
    manifest(): {
        name: string;
        short_name: string;
        start_url: string;
        display: string;
        description: string;
        theme_color: string;
        background_color: string;
        icons: {
            src: string;
            sizes: string;
            type: string;
        }[];
    } & {
        name: any;
        short_name: any;
        description: any;
        theme_color: any;
        background_color: any;
    };
    serviceWorker(): Promise<any>;
    index(): Promise<string>;
}
