import { Mutable } from './abstract/Mutable';
import { NotificationDocument } from '../models/Notification';
export declare class NotificationController extends Mutable<NotificationDocument> {
    constructor();
    insert(props: {
        what: any;
    }, res: unknown, decodedToken: any): Promise<any>;
    ping(props: {
        last_id: string;
    }, res: unknown, decodedToken: any): Promise<any>;
}
