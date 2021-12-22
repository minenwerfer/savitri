"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Access = exports.AccessSchema = exports.Description = void 0;
const database_1 = require("../../database");
const _Util_1 = require("../_Util");
const index_json_1 = __importDefault(require("../../../../data/models/common/Access/index.json"));
Object.defineProperty(exports, "Description", { enumerable: true, get: function () { return index_json_1.default; } });
exports.AccessSchema = (0, _Util_1.descriptionToSchema)(index_json_1.default);
exports.Access = (0, database_1.model)('Access', exports.AccessSchema);
