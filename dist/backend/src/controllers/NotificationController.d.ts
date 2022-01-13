import { Mutable } from './abstract/Mutable';
import { NotificationDocument } from '../models/Notification';
export declare class NotificationController extends Mutable<NotificationDocument> {
    constructor();
    notify(props: {
        destination: string;
        title: string;
        content: string;
        action?: string;
        subject?: string;
    }, res: unknown, decodedToken: any): any;
    ping(props: {
        last_id: string;
    }, res: unknown, decodedToken: any): any;
}
