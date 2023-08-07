"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs_1 = __importDefault(require("ejs"));
const constants_1 = require("../constants");
exports.default = (instanceConfig) => {
    return {
        name: `${constants_1.PLUGIN_PREFIX}:transform-index-html`,
        transformIndexHtml(html) {
            return ejs_1.default.render(html, { instanceConfig });
        }
    };
};
