"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const feedback_mdl_1 = require("./feedback.mdl");
const index_json_1 = __importDefault(require("./index.json"));
const controller_1 = require("../../src/controller");
class FeedbackController extends controller_1.Mutable {
    constructor() {
        super(feedback_mdl_1.Feedback, index_json_1.default);
    }
}
exports.FeedbackController = FeedbackController;
//# sourceMappingURL=feedback.ctl.js.map