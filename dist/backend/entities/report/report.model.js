"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = exports.ReportSchema = void 0;
const database_1 = require("../../core/database");
const entity_1 = require("../../core/entity");
const index_json_1 = __importDefault(require("./index.json"));
require("../user/user.model");
exports.ReportSchema = (0, entity_1.descriptionToSchema)(index_json_1.default, database_1.options);
exports.Report = (0, database_1.model)('Report', exports.ReportSchema);
//# sourceMappingURL=report.model.js.map