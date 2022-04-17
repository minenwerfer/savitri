import { Mutable } from '../../controller';
import { NotificationDocument } from './notification.mdl';
import { RequestProvider } from '../../../../common/src/http';
export interface NotificationController {
    http: RequestProvider;
}
export declare class NotificationController extends Mutable<NotificationDocument> {
    constructor();
    ping(props: {
        last_id: string;
        localOnly: boolean;
    }, res: unknown, decodedToken: any): Promise<{}>;
}
