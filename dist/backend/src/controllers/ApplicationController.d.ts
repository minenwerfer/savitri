import { Controller } from './abstract/Controller';
export declare class ApplicationController extends Controller<unknown> {
    constructor();
    manifest(): {
        display: string;
        start_url: string;
        icons: {
            src: string;
            sizes: string;
            type: string;
        }[];
        name: string;
        short_name: string;
        description: string;
        theme_color: string;
        background_color: string;
    };
}
