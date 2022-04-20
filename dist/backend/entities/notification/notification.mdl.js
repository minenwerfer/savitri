"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.NotificationSchema = void 0;
const database_1 = require("../../src/database");
const entity_1 = require("../../src/entity");
const index_json_1 = __importDefault(require("./index.json"));
require("../user/user.mdl");
exports.NotificationSchema = (0, entity_1.descriptionToSchema)(index_json_1.default, database_1.options);
exports.Notification = (0, database_1.model)('Notification', exports.NotificationSchema);
//# sourceMappingURL=notification.mdl.js.map