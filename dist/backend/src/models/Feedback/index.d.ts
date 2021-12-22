/// <reference types="mongoose" />
import { Document } from '../../database';
import { default as Description } from '../../../../data/models/common/Feedback/index.json';
export { Description };
import { UserDocument } from '../User';
import '../User';
export interface FeedbackDocument extends Document {
    user_id: UserDocument;
    comment: string;
}
export declare const FeedbackSchema: import("mongoose").Schema<FeedbackDocument, import("mongoose").Model<FeedbackDocument, any, any, any>, any>;
export declare const Feedback: import("mongoose").Model<FeedbackDocument, {}, {}, {}>;
