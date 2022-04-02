/// <reference types="packages/backend/node_modules/mongoose" />
import { Document } from '../../database';
import { default as Description } from '../../../../data/entities/common/Notification/index.json';
export { Description };
import { UserDocument } from '../User';
import '../User';
export interface NotificationDocument extends Document {
    user_id: UserDocument | string;
    destination: UserDocument | string;
    title: string;
    content: string;
    action: string;
    subject: string;
}
export declare const NotificationSchema: import("mongoose").Schema<NotificationDocument, import("mongoose").Model<NotificationDocument, any, any, any>, any, any>;
export declare const Notification: import("mongoose").Model<NotificationDocument, {}, {}, {}>;
