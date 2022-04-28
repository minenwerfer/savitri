import { Mutable } from '../../core/controller';
import { NotificationDocument } from './notification.model';
import { RequestProvider } from '../../../common/src/http';
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
