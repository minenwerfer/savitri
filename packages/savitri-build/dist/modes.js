"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.serve = void 0;
const vite_1 = require("vite");
const projectRoot = process.cwd();
const buildRoot = __dirname;
const serve = async () => {
    const server = await (0, vite_1.createServer)({
        configFile: `${buildRoot}/vite.js`,
        root: projectRoot,
        server: {
            port: 8080
        }
    });
    await server.listen();
    server.printUrls();
};
exports.serve = serve;
const build = async () => {
    const { default: config } = await Promise.resolve(`${`${buildRoot}/vite.js`}`).then(s => __importStar(require(s)));
    return (0, vite_1.build)(await config());
};
exports.build = build;
