import { RequestProvider } from '../../../common';
export interface Controller {
    http: RequestProvider;
    tokenSecret?: string;
}
export declare const forwardRequest: (route: string, secret?: string | undefined) => (this: Controller, props: unknown, req: unknown, decodedToken: any) => Promise<void>;
