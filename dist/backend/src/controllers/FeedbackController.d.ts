import { FeedbackDocument } from '../models/Feedback';
import { Mutable } from './abstract/Mutable';
export declare class FeedbackController extends Mutable<FeedbackDocument> {
    constructor();
    insert(props: {
        what: FeedbackDocument;
    }, response: unknown, decodedToken: any): Promise<any>;
}
