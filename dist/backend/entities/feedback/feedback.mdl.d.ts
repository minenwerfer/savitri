/// <reference types="packages/backend/node_modules/mongoose" />
import { Document } from '../../src/database';
import { UserDocument } from '../user/user.mdl';
import '../user/user.mdl';
export interface FeedbackDocument extends Document {
    user_id: UserDocument;
    comment: string;
}
export declare const FeedbackSchema: import("mongoose").Schema<FeedbackDocument, import("mongoose").Model<FeedbackDocument, any, any, any>, any, any>;
export declare const Feedback: import("mongoose").Model<FeedbackDocument, {}, {}, {}>;
