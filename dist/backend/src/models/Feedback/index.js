"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = exports.FeedbackSchema = exports.Description = void 0;
const database_1 = require("../../database");
const entity_1 = require("../../entity");
const index_json_1 = __importDefault(require("../../../../data/entities/common/Feedback/index.json"));
Object.defineProperty(exports, "Description", { enumerable: true, get: function () { return index_json_1.default; } });
require("../User");
exports.FeedbackSchema = (0, entity_1.descriptionToSchema)(index_json_1.default, database_1.options);
exports.Feedback = (0, database_1.model)('Feedback', exports.FeedbackSchema);
//# sourceMappingURL=index.js.map