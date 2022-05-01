"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPreset = void 0;
const merge_1 = __importDefault(require("lodash/merge"));
const applyPreset = (description, name, parent) => {
    const preset = require(__dirname + `/../../../data/presets/${name}`);
    const presetObject = Object.assign({}, parent ? (preset[parent] || {}) : preset);
    return (0, merge_1.default)(description, presetObject);
};
exports.applyPreset = applyPreset;
//# sourceMappingURL=preset.js.map