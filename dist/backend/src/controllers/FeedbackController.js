"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const Feedback_1 = require("../models/Feedback");
const Mutable_1 = require("./abstract/Mutable");
class FeedbackController extends Mutable_1.Mutable {
    constructor() {
        super(Feedback_1.Feedback, Feedback_1.Description);
    }
    insert(props, response, decodedToken) {
        props.what.user_id = decodedToken._id;
        return super.insert.call(this, props, response, decodedToken);
    }
}
exports.FeedbackController = FeedbackController;
//# sourceMappingURL=FeedbackController.js.map