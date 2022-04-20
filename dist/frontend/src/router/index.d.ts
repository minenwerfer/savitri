import { RouteRecordRaw } from 'vue-router';
/**
 * @exports
 * Just a bare template for nested children.
 */
export declare const BareTemplate: {
    template: string;
};
export interface RouteMeta {
    meta?: {
        title: string;
        hidden?: boolean;
        isPrivate?: boolean;
        order?: number;
    };
}
export declare type RouterExtension = {
    [key: string]: Route[];
};
export declare type Route = RouteMeta & RouteRecordRaw & {
    children?: Route[];
    components?: any;
};
/**
 * @exports
 * Non authenticated routes.
 */
export declare const publicRoutes: Route[];
/**
 * @exports
 * Authenticated routes.
 */
export declare const privateRoutes: Route[];
/**
 * @exports
 */
export declare const makeRoutes: (publicRoutes: Route[], privateRoutes: Route[]) => Route[];
/**
 * @exports
 * All routes. You may import it for using in whatever component.
 */
export declare const routes: Route[];
/**
 * @exports
 * The router instance.
 */
export declare const instance: (store: any) => import("vue-router").Router;
export declare const extendRouter: (router: any, routerExtension: RouterExtension) => void;
