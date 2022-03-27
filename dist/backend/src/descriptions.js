"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDescriptions = void 0;
const User_1 = require("./models/User");
const AccessProfile_1 = require("./models/AccessProfile");
const Feedback_1 = require("./models/Feedback");
const File_1 = require("./models/File");
const Notification_1 = require("./models/Notification");
const Report_1 = require("./models/Report");
const index_json_1 = __importDefault(require("../../data/entities/common/Release/index.json"));
exports.defaultDescriptions = {
    user: User_1.Description,
    accessProfile: AccessProfile_1.Description,
    feedback: Feedback_1.Description,
    file: File_1.Description,
    notification: Notification_1.Description,
    report: Report_1.Description,
    release: index_json_1.default
};
//# sourceMappingURL=descriptions.js.map