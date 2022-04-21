"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessProfile = exports.AccessProfileSchema = void 0;
const database_1 = require("../../core/database");
const entity_1 = require("../../core/entity");
const index_json_1 = __importDefault(require("./index.json"));
exports.AccessProfileSchema = (0, entity_1.descriptionToSchema)(index_json_1.default, database_1.options);
exports.AccessProfile = (0, database_1.model)('AccessProfile', exports.AccessProfileSchema);
//# sourceMappingURL=accessProfile.model.js.map