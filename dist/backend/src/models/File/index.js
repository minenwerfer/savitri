"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = exports.FileSchema = exports.Description = void 0;
const database_1 = require("../../database");
const entity_1 = require("../../entity");
const index_json_1 = __importDefault(require("../../../../data/entities/common/File/index.json"));
Object.defineProperty(exports, "Description", { enumerable: true, get: function () { return index_json_1.default; } });
require("../User");
exports.FileSchema = (0, entity_1.descriptionToSchema)(index_json_1.default, database_1.options);
exports.File = (0, database_1.model)('File', exports.FileSchema);
//# sourceMappingURL=index.js.map