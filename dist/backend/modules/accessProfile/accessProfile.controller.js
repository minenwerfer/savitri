"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessProfileController = void 0;
const accessProfile_model_1 = require("./accessProfile.model");
const index_json_1 = __importDefault(require("./index.json"));
const controller_1 = require("../../core/controller");
class AccessProfileController extends controller_1.Mutable {
    constructor() {
        super(accessProfile_model_1.AccessProfile, index_json_1.default, {
            publicMethods: ['getAll']
        });
    }
}
exports.AccessProfileController = AccessProfileController;
//# sourceMappingURL=accessProfile.controller.js.map