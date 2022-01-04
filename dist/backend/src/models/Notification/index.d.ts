/// <reference types="mongoose" />
import { Document } from '../../database';
import { default as Description } from '../../../../data/models/common/Notification/index.json';
export { Description };
import { UserDocument } from '../User';
import '../User';
export interface NotificationDocument extends Document {
    user_id: UserDocument;
    title: string;
    content: string;
    action: string;
    subject: string;
}
export declare const NotificationSchema: import("mongoose").Schema<NotificationDocument, import("mongoose").Model<NotificationDocument, any, any, any>, any>;
export declare const Notification: import("mongoose").Model<NotificationDocument, {}, {}, {}>;
