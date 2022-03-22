"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDescriptions = exports.options = exports.mongoose = void 0;
__exportStar(require("./src/controllers/abstract/Mutable"), exports);
__exportStar(require("./src/controllers/abstract/Controller"), exports);
__exportStar(require("./src/models/_Util"), exports);
exports.mongoose = __importStar(require("./src/database"));
var database_1 = require("./src/database");
Object.defineProperty(exports, "options", { enumerable: true, get: function () { return database_1.options; } });
__exportStar(require("./src/services"), exports);
const User_1 = require("./src/models/User");
const AccessProfile_1 = require("./src/models/AccessProfile");
const Feedback_1 = require("./src/models/Feedback");
const File_1 = require("./src/models/File");
const Notification_1 = require("./src/models/Notification");
const Report_1 = require("./src/models/Report");
const index_json_1 = __importDefault(require("../data/entities/common/Release/index.json"));
exports.defaultDescriptions = {
    user: User_1.Description,
    accessProfile: AccessProfile_1.Description,
    feedback: Feedback_1.Description,
    file: File_1.Description,
    notification: Notification_1.Description,
    report: Report_1.Description,
    release: index_json_1.default
};
//# sourceMappingURL=index.js.map