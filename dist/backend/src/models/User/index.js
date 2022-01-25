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
exports.User = exports.UserSchema = exports.Description = void 0;
const bcrypt = __importStar(require("bcrypt"));
const database_1 = require("../../database");
const _Util_1 = require("../_Util");
const index_json_1 = __importDefault(require("../../../../data/entities/common/User/index.json"));
Object.defineProperty(exports, "Description", { enumerable: true, get: function () { return index_json_1.default; } });
require("../AccessProfile");
exports.UserSchema = (0, _Util_1.descriptionToSchema)(index_json_1.default, database_1.options);
exports.UserSchema.plugin(require('mongoose-autopopulate'));
/**
 * @function
 * Will hash password before it's saved.
 */
exports.UserSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 10);
});
/**
 * @function
 * Will return true if password matches.
 */
exports.UserSchema.methods.testPassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};
/**
 * @exports
 * User model.
 */
exports.User = (0, database_1.model)('User', exports.UserSchema);
//# sourceMappingURL=index.js.map