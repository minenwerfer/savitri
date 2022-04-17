"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const feedback_mdl_1 = require("./feedback.mdl");
const controller_1 = require("../../controller");
class FeedbackController extends controller_1.Mutable {
    constructor() {
        super(feedback_mdl_1.Feedback, feedback_mdl_1.Description);
    }
}
exports.FeedbackController = FeedbackController;
//# sourceMappingURL=feedback.ctl.js.map